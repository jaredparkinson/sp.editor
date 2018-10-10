import { HttpClient } from '@angular/common/http';
import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';

import { log } from 'util';
import { Paragraph } from '../models/Paragraph';
import { Verse } from '../models/Verse';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { VerseSelectService } from '../services/verse-select.service';
@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss']
})
export class BodyblockComponent implements OnInit, AfterViewInit {
  private timer: NodeJS.Timer;
  private timer2: NodeJS.Timer;
  // private styleTag = document.querySelector(
  //   '#highlightStyle'
  // ) as HTMLStyleElement;
  public highlightClasses = '';
  public highlightClasses2 = '';
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  constructor(
    public fileManager: NavigationService,
    public httpClient: HttpClient,
    // public activatedRoute: ActivatedRoute,
    public chapterService: ChapterService,
    public navService: NavigationService,
    public saveState: SaveStateService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    public verseSelectService: VerseSelectService
  ) {}

  getBodyBlock(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.chapterService.bodyBlock
    );
    // return this.chapterService.bodyBlock;
  }
  ngOnInit() {
    this.initSyncScrolling();
    this.route.params.subscribe(params => {
      this.navService.rightPaneToggle = false;
      this.navService.leftPaneToggle = false;
      // console.log(params);

      const book = params['book'];
      const chapter = params['chapter'];

      setTimeout(() => {
        if (book !== undefined && chapter !== undefined) {
          // console.log(book);
          // console.log(chapter);
          this.chapterService.getChapter(
            book,
            chapter,
            this.synchronizedScrolling
          );
        } else if (book === undefined && chapter !== undefined) {
          this.chapterService.getChapter(
            chapter,
            '',
            this.synchronizedScrolling
          );
        }

        // this.synchronizedScrolling();
      }, 200);
    });
    // this.verseSelection();
    this.wordSelection();

    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        // console.log('span.verse ' + document.querySelector('span.verse'));

        _.each(document.querySelectorAll('span.verse'), verse => {
          (verse as HTMLElement).addEventListener('mouseup', event => {
            this.verseSelectService.wTagClick(event);
          });
        });
      });
    }, 2000);
  }

  private wordSelection() {
    _.each(document.querySelectorAll('w'), wTag => {});
  }

  public wTagClick(event: Event) {}

  trackById(index: number, paragraph: any) {
    return paragraph.id;
  }
  private verseSelection(): void {
    this.ngZone.runOutsideAngular(() => {
      // setInterval(() => {}, 7500);
      document.getElementById('bodyBlock').addEventListener('mouseup', () => {
        console.log('mouseup');

        const range = window.getSelection();

        const df = range.getRangeAt(0).cloneContents();
        const wTags = _.toArray(df.querySelectorAll('w'));
        console.log(wTags.length);

        wTags.pop();
        _.each(wTags, wTag => {
          // console.log(wTag);

          const id = wTag.getAttribute('n').split('-');

          const data = this.chapterService.wTags.querySelector(
            '#' + id[0] + ' w[n="' + id[1] + '"]'
          );
          if (data.hasAttribute('ref')) {
            // document
            //   .querySelector('w[n="' + wTag.getAttribute('n') + '"]')
            //   .classList.add('wtag');
          }
        });

        if (range.anchorNode !== null) {
        }
      });
    });
  }

  ngAfterViewInit() {}
  onScroll() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.synchronizedScrolling();
    }, 50);
    this.timer2 = setTimeout(() => {
      this.synchronizedScrolling();
    }, 200);
    // this.ngZone.runOutsideAngular();
  }
  // private nodeListOfToArray(list: NodeListOf<Element>): Element[] {
  //   return Array.prototype.slice.call(list) as Element[];
  // }
  synchronizedScrolling(): void {
    const verses = document.querySelectorAll('span.verse');
    let scrollIntoView: Element;

    _.toArray<Element>(verses).some(element => {
      const top = element.getBoundingClientRect().top;
      const height = element.getBoundingClientRect().height;
      const start = 35;
      if (top + height > start && top < start + height) {
        scrollIntoView = element;
      } else if (scrollIntoView !== undefined) {
        const noteID =
          'note' + scrollIntoView.id.substring(1, scrollIntoView.id.length);

        console.log('nojgtgcd' + noteID);

        document.getElementById(noteID).scrollIntoView();

        return true;
      }
    });

    // tslint:disable-next-line:prefer-for-of
    // for (let x = 0; x < verses.length; x++) {
    //   const element = verses[x];
    //   const top = element.getBoundingClientRect().top;
    //   const height = element.getBoundingClientRect().height;
    //   const start = 35;
    //   if (top + height > start && top < start + height) {
    //     scrollIntoView = element;
    //   } else if (scrollIntoView !== undefined) {
    //     const noteID =
    //       'note' + scrollIntoView.id.substring(1, scrollIntoView.id.length);

    //     console.log('nojgtgcd' + noteID);

    //     document.getElementById(noteID).scrollIntoView();

    //     break;
    //   }
    // }

    if (scrollIntoView === undefined) {
      console.log(scrollIntoView);

      const element = verses[0];

      const top = element.getBoundingClientRect().top;
      const height = element.getBoundingClientRect().height;

      // console.log('Top: ' + top + ' height: ' + height + ' start: ' + start);

      const start = 35;
      if (top + height > start) {
        this.scrollNotesTop();
        // console.log('test gojbvhgv');
      } else {
        this.scrollNotesBottom();
      }
    }
  }

  private scrollNotesBottom() {
    const notes = document.querySelectorAll('note');
    notes[notes.length - 1].scrollIntoView();
  }

  private scrollNotesTop() {
    document.querySelector('note').scrollIntoView();
  }

  private initSyncScrolling() {
    this.ngZone.runOutsideAngular(() => {
      document.getElementById('appBodyBlock').addEventListener('wheel', () => {
        this.onScroll();
      });
      document
        .getElementById('appBodyBlock')
        .addEventListener('touchend', () => {
          this.onScroll();
        });
    });
  }
}
