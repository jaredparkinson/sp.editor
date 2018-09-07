import { HttpClient } from '@angular/common/http';
import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  NgZone,
  OnInit
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { log } from 'util';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { TSQuery } from '../TSQuery';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss']
})
export class BodyblockComponent implements OnInit, AfterViewInit {
  private timer: NodeJS.Timer;
  private timer2: NodeJS.Timer;
  private tsQuery: TSQuery = new TSQuery();
  public highlightClasses = '';
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
      // console.log(params);

      // this.id = +params['b']; // (+) converts string 'id' to a number
      const book = params['book'];
      const chapter = params['chapter'];
      if (book !== undefined && chapter !== undefined) {
        // console.log(book);
        // console.log(chapter);
        this.chapterService.getChapter(book, chapter);
      } else if (book === undefined && chapter !== undefined) {
        this.chapterService.getChapter(chapter, '');
      }
      setTimeout(() => {
        this.route.queryParams.subscribe(v => {
          if (v['verse'] !== undefined) {
            const verseParams = (v['verse'] as string).split(',');
            // const verseSelect = verseParams[0].split('-')[0];
            this.selectVerse(verseParams[0].split('-')[0]);

            // let selectedVerse = false;
            this.highlightVerses(verseParams);
          } else {
            console.log('1');
            document.getElementById('title1').scrollIntoView();
            this.scrollNotesTop();
          }
        });
      }, 600);
    });
    this.verseSelection();
    // this.ngZone.runOutsideAngular(() => {
    //   document.getElementById('bodyBlock').addEventListener('wheel', () => {
    //     console.log('test');
    //   });
    // });
  }

  private verseSelection(): void {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {}, 7500);
      document.getElementById('bodyBlock').addEventListener('mouseup', () => {
        const range = window.getSelection();
        if (range.anchorNode !== null) {
          // console.log(range.getRangeAt(0).startContainer);
          // const start = window.getSelection().getRangeAt(0).startContainer
          //   .parentElement.attributes['n'].value;
          // const end = window.getSelection().getRangeAt(0).endContainer
          //   .parentElement.attributes['n'].value;
          // console.log(start + ' ' + end);
          const df = range.getRangeAt(0).cloneContents();
          const wTags = df.querySelectorAll('w');

          Array.prototype.slice.call(wTags).forEach(wTag => {
            console.log(wTag);
          });
          // console.log(wTags);
        }
      });
    });
  }

  private highlightVerses(verseParams: string[]) {
    this.highlightClasses = '';
    for (const verseParam of verseParams) {
      console.log('Verse Parm: ' + verseParam);
      const verseHightLight = verseParam.split('-');

      if (verseHightLight.length === 1) {
        this.highlightClasses += ' p' + verseHightLight[0];
      }
      for (
        let x = parseInt(verseHightLight[0], 10);
        x <= parseInt(verseHightLight[1], 10);
        x++
      ) {
        this.highlightClasses += ' p' + x;
      }
    }
  }

  private selectVerse(verseSelect: string) {
    const verse = document.getElementById('p' + verseSelect);
    if (verse !== null) {
      verse.scrollIntoView();
      document.getElementById('note' + verseSelect).scrollIntoView();
      // console.log('verse: ' + v['verse']);
    }
  }

  ngAfterViewInit() {
    // asdf.scrollIntoView();
    // this.route.queryParams.subscribe(qp => {
    //   const verse = qp['verse'];
    //   const asdf = document.getElementById('p' + verse);
    //   console.log('asdf ' + asdf);
    //   asdf.scrollIntoView();
    // });
  }
  onScroll() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.synchronizedScrolling();
    }, 50);
    this.timer2 = setTimeout(() => {
      this.synchronizedScrolling();
    }, 1000);
    // this.ngZone.runOutsideAngular();
  }

  synchronizedScrolling(): void {
    const verses = document.querySelectorAll('span.verse');
    let scrollIntoView: Element;

    for (let x = 0; x < verses.length; x++) {
      const element = verses[x];
      const top = element.getBoundingClientRect().top;
      const height = element.getBoundingClientRect().height;
      const start = 35;
      if (top + height > start && top < start + height) {
        scrollIntoView = element;
      } else if (scrollIntoView !== undefined) {
        const noteID =
          'note' + scrollIntoView.id.substring(1, scrollIntoView.id.length);

        document.getElementById(noteID).scrollIntoView();

        break;
      }
    }

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
