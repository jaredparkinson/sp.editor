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
    private ngZone: NgZone
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
  }

  private wordSelection() {
    _.each(document.querySelectorAll('w'), wTag => {});
  }

  public wTagClick(event: Event) {
    if (this.chapterService.verseSelect) {
      const ids = (event.target as HTMLUnknownElement)
        .getAttribute('n')
        .split('-');
      const targer = _.find(this.chapterService.wTagRefs, wTagRef => {
        return (
          (wTagRef as HTMLElement).getAttribute('n') === ids[1] &&
          (wTagRef as HTMLElement).parentElement.id === ids[0]
        );
      });
      const refs = (targer as HTMLUnknownElement)
        .getAttribute('ref')
        .split(',');
      const matches: Array<[string, string, number]> = []; // = [];

      _.each(this.chapterService.wTagRefs, wTagRef => {
        const refs2 = wTagRef.getAttribute('ref').split(',');
        if (_.intersection(refs, refs2).length > 0) {
          // console.log(
          //   _.intersection(refs, refs2).length + ' ' + wTagRef.parentElement.id
          // );
          matches.push([
            wTagRef.parentElement.id,
            wTagRef.getAttribute('n'),
            _.intersection(refs, refs2).length
          ]);
        }
      });

      const parser = new DOMParser();

      _.each(this.chapterService.paragraphs, paragraph => {
        _.each(paragraph.verses, verse => {
          const matchedMatches = _.filter(matches, match => {
            return match[0] === verse.id;
          });
          const doc = parser.parseFromString(verse.innerHtml, 'text/html');

          _.each(doc.querySelectorAll('w'), wTag => {
            if (wTag.className.includes('verse-select')) {
              wTag.className = 'verse-select-0';
            }
          });

          if (matchedMatches.length > 0) {
            console.log('pasdf ' + matchedMatches.length);

            _.each(matchedMatches, m => {
              // console.log('#' + m[0] + ' w[n="' + m[0] + '-' + m[1] + '"]');

              const underline = m[2] > 1 ? 'verse-select-1' : 'verse-select-2';
              const wTag = doc.querySelector(
                ' w[n="' + m[0] + '-' + m[1] + '"]'
              );
              console.log(wTag.innerHTML + ' added class here');

              wTag.classList.add(underline);
              wTag.classList.remove('verse-select-0');
            });

            verse.innerHtml = doc.querySelector('body').innerHTML;
          }
        });
      });
    }

    // console.log(
    //   'wtag selected ' +
    //     (targer as HTMLUnknownElement).innerHTML +
    //     ' ' +
    //     (targer as HTMLUnknownElement).getAttribute('ref') +
    //     ' ' +
    //     (event.currentTarget as HTMLElement).parentElement.id
    // );
  }

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
