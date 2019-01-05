import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';

import { Verse } from '../modelsJson/Verse';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { StringService } from '../services/string.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss']
})
export class BodyblockComponent
  implements OnInit, AfterViewInit, AfterContentInit {
  private timer: NodeJS.Timer;

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  @ViewChildren('verses')
  verses!: QueryList<ElementRef>;
  constructor(
    public fileManager: NavigationService,
    public httpClient: HttpClient,
    // public activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public chapterService: ChapterService,
    public navService: NavigationService,
    public saveState: SaveStateService,
    public stringService: StringService,
    private route: ActivatedRoute
  ) {}

  ngAfterContentInit(): void {}
  ngOnInit() {
    this.initSyncScrolling();
    this.route.params.subscribe(params => {
      this.navService.rightPaneToggle = false;
      this.navService.leftPaneToggle = false;

      const book = params['book'];
      const chapter = params['chapter'];

      setTimeout(async () => {
        if (book !== undefined && chapter !== undefined) {
          await this.chapterService.getChapter(book, chapter).then(() => {
            // console.log(this.synchronizedScrolling());
            // this.synchronizedScrolling();
            this.chapterService.resetVerseSelect();
          });
        } else if (book === undefined && chapter !== undefined) {
          await this.chapterService.getChapter(chapter, '').then(() => {
            this.chapterService.resetVerseSelect();
          });
          // setTimeout(() => {
          //   if (this.saveState.data.verseSelect) {
          //     this.chapterService.resetVerseSelect();
          //   }
          // }, 1000);
        }
        console.log('btsxyd');
      }, 0);
      setTimeout(() => {
        this.synchronizedScrolling();
      }, 1000);
    });
    this.wordSelection();
  }

  getSuperScriptVisibility(item: string): boolean {
    if (
      (item.includes('new-') && this.saveState.data.newNotesVisible) ||
      (item.includes('tc-') && this.saveState.data.translatorNotesVisible) ||
      (item.includes('eng-') && this.saveState.data.englishNotesVisible)
    ) {
      return true;
    }
    return false;
  }

  getWColor(
    w: [
      string,
      string,
      string,
      string,
      string,
      string,
      number,
      string[],
      boolean
    ]
  ) {
    let wClass = w[0];

    if (w[0].includes('verse-select')) {
      if (this.saveState.data.verseSuperScripts) {
        if (w[4].trim().length > 0 && this.saveState.data.englishNotesVisible) {
          wClass = this.stringService.addAttribute(wClass, 'eng-color');
        } else if (
          w[5].trim().length > 0 &&
          this.saveState.data.translatorNotesVisible
        ) {
          wClass = this.stringService.addAttribute(wClass, 'tc-color');
        } else if (
          w[3].trim().length > 0 &&
          this.saveState.data.newNotesVisible
        ) {
          wClass = this.stringService.addAttribute(wClass, 'new-color');
        }
      }
    }

    return wClass;
  }

  private wordSelection() {
    lodash.each(document.querySelectorAll('w'), () => {});
  }

  trackById(paragraph: any) {
    return paragraph.id;
  }

  wTagTrackBy(
    wTag: [
      string,
      string,
      string,
      string,
      string,
      string,
      number,
      string[],
      string[],
      boolean
    ]
  ) {
    return wTag[2];
  }

  wTagClick(
    wTag: [
      string,
      string,
      string,
      string,
      string,
      string,
      number,
      string[],
      string[],
      boolean
    ],
    verse: Verse,
    event: Event
  ) {
    if (!this.saveState.data.rightPanePin) {
    }
    this.saveState.data.notesPopover = true;
    console.log(wTag);
    console.log((event.currentTarget as Element).getBoundingClientRect());

    this.chapterService.wTagClick(wTag, verse);
  }

  async ngAfterViewInit() {
    // this.verses.changes.subscribe(() => {
    //   setTimeout(async () => {
    //     this.chapterService.verses = this.verses.toArray();
    //     await this.synchronizedScrolling().catch(err => {
    //       console.log('failed');
    //     });
    //   }, 100);
    // });
    // this.verses.changes.subscribe(() => {
    //   setTimeout(() => {
    //     this.chapterService.wTags = this.wTags.toArray();
    //   }, 100);
    // });
  }
  onScroll() {
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      console.log(this.verses);

      await this.synchronizedScrolling();
    }, 50);
    // this.ngZone.runOutsideAngular();
  }
  // private nodeListOfToArray(list: NodeListOf<Element>): Element[] {
  //   return Array.prototype.slice.call(list) as Element[];
  // }
  async synchronizedScrolling(): Promise<void> {
    const verses = document.querySelectorAll('span.verse');
    console.log(
      'sync scrolling 2 ' + document.querySelectorAll('.verse').length
    );

    console.log('sync scrolling ' + this.verses.length);

    let scrollIntoView: Element;

    lodash.forEach(this.verses.toArray(), verse => {
      const top = (verse.nativeElement as HTMLElement).getBoundingClientRect()
        .top;
      const height = (verse.nativeElement as HTMLElement).getBoundingClientRect()
        .height;
      const start = 35;
      if (top + height > start && top < start + height) {
        scrollIntoView = verse.nativeElement as HTMLElement;
      } else if (scrollIntoView !== undefined) {
        const noteID =
          'note' + scrollIntoView.id.substring(1, scrollIntoView.id.length);

        console.log('nojgtgcd' + noteID);

        document.getElementById(noteID).scrollIntoView();

        return true;
      }
    });

    this.chapterService.scrollIntoView = scrollIntoView;
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
    this.chapterService.scrollIntoView = notes[notes.length - 1];
    this.chapterService.scrollIntoView.scrollIntoView();
  }

  private scrollNotesTop() {
    this.chapterService.scrollIntoView = document.querySelector('note');
    this.chapterService.scrollIntoView.scrollIntoView();
    // scrollIntoView;
  }

  private initSyncScrolling() {
    // this.ngZone.runOutsideAngular(() => {
    //   document.getElementById('appBodyBlock').addEventListener('wheel', () => {
    //     this.onScroll();
    //   });
    //   document
    //     .getElementById('appBodyBlock')
    //     .addEventListener('touchend', () => {
    //       this.onScroll();
    //     });
    // });
  }
}
