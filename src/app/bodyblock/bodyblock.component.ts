import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { resolve } from 'path';
import { Verse } from '../modelsJson/Verse';
import { W } from '../modelsJson/WTag';
import { ChapterService } from '../services/chapter.service';
import { EditService } from '../services/EditService';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { StringService } from '../services/string.service';
import { VerseSelectService } from '../services/verse-select.service';
import { W2 } from '../modelsJson/W2';
import { TemplateGroup } from '../modelsJson/TemplateGroup';
import { WTagService } from '../services/wtag-builder.service';
import { VerseComponent } from '../components/verse/verse.component';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss'],
})
export class BodyblockComponent
  implements OnInit, AfterViewInit, AfterContentInit {
  private timer: NodeJS.Timer;

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  @ViewChildren('verses')
  verses!: QueryList<VerseComponent>;
  constructor(
    public fileManager: NavigationService,
    public httpClient: HttpClient,
    public sanitizer: DomSanitizer,
    public chapterService: ChapterService,
    public editService: EditService,
    public navService: NavigationService,
    public saveState: SaveStateService,
    public stringService: StringService,
    public verseSelectService: VerseSelectService,
    private route: ActivatedRoute,
    private wTagBuilderService: WTagService,
  ) {}

  ngAfterContentInit(): void {}
  ngOnInit() {
    this.initSyncScrolling();
    this.route.params.subscribe(params => {
      this.navService.rightPaneToggle = false;
      this.navService.leftPaneToggle = false;

      console.log(params);

      const book = params['book'];
      const chapter = params['chapter'];

      if (book !== undefined && chapter !== undefined) {
        this.chapterService
          .getChapter(book, chapter)
          .then(async (value: void) => {
            console.log(value);

            this.verseSelectService.resetVisibility().then(() => {
              this.wTagBuilderService.buildWTags().then(() => {
                setTimeout(() => {
                  this.synchronizedScrolling();
                }, 50);
              });
            });
          });
      } else if (book === undefined && chapter !== undefined) {
        this.chapterService.getChapter(chapter, '').then(() => {
          this.verseSelectService.resetVisibility().then(() => {
            setTimeout(() => {
              this.synchronizedScrolling();
            }, 50);
          });
        });
      }
    });
    this.wordSelection();
  }

  getSuperScriptVisibility(
    item: string,
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
    ],
  ): boolean {
    console.log(w);

    if (
      (item.includes('new-') && this.saveState.data.newNotesVisible) ||
      (item.includes('tc-') && this.saveState.data.translatorNotesVisible) ||
      (item.includes('eng-') && this.saveState.data.englishNotesVisible)
    ) {
      return true;
    }
    return false;
  }

  public stringSplit(text: string): string[] {
    return Array.from(text);
  }

  getWColor(w: TemplateGroup) {
    if (!w.classList) {
      return '';
    }
    let wClass = w.classList.toString().replace(/\,/g, ' ');

    if (
      w.classList.includes('verse-select-1') &&
      w.classList.includes('verse-select-2')
    ) {
      console.log(wClass);
    }
    let engVis = true;
    let newVis = true;
    let tcVis = true;

    if (w.classList.includes('verse-select')) {
      if (this.saveState.data.verseSuperScripts) {
        w.refs.forEach(ref => {
          const engRegex = new RegExp(`\d{9}`);
          const newRegex = new RegExp(`\d{4}(\-\d{2}){6}`);
          const tcRegex = new RegExp(`tc.*`);

          if (this.verseSelectService.noteVisibility.get(ref)) {
            if (engRegex.exec(ref)) {
              engVis = true;
            } else if (newRegex.exec(ref)) {
              newVis = true;
            } else if (tcRegex.exec(ref)) {
              tcVis = true;
            }
          }
        });

        if (engVis) {
          wClass = this.stringService.addAttribute(wClass, 'eng-color');
        }
        if (newVis) {
          wClass = this.stringService.addAttribute(wClass, 'tc-color');
        }
        if (tcVis) {
          wClass = this.stringService.addAttribute(wClass, 'new-color');
        }
      }
    }

    return wClass;
  }

  public getTemplateGroups(verse: Verse): TemplateGroup[] {
    let templateGroups: TemplateGroup[] = [];
    let tempTemplateGroup: TemplateGroup = new TemplateGroup();

    for (let x = 0; x < Array.from(verse.text).length; x++) {
      const t = verse.text[x];

      tempTemplateGroup.text = `${tempTemplateGroup.text}${t}`;

      if (verse.w2[x]) {
        tempTemplateGroup.isWTag = true;
        tempTemplateGroup.classList = verse.w2[x].classList;
        tempTemplateGroup.refs = verse.w2[x].classList;
      }

      if (
        x + 1 === verse.text.length ||
        !this.isPartOfGroup(verse.w2[x], verse.w2[x + 1])
      ) {
        templateGroups.push(tempTemplateGroup);
        tempTemplateGroup = new TemplateGroup();
      }
    }

    console.log(templateGroups);

    return templateGroups;
  }
  isPartOfGroup(w1: W2, w2: W2): boolean {
    if (w1 === w2) {
      return true;
    } else {
      if (!w1 || !w2) {
        return false;
      } else if (
        lodash.isEqual(w1.classList, w2.classList) &&
        lodash.isEqual(w1.refs, w2.refs)
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  private wordSelection() {
    lodash.each(document.querySelectorAll('w'), () => {});
  }

  trackById(paragraph: any) {
    return paragraph.id;
  }

  wTagClick(wTag: W, verse: Verse, event: Event) {
    if (!this.saveState.data.rightPanePin) {
    }
    this.saveState.data.notesPopover = true;
    console.log(wTag);
    console.log((event.currentTarget as Element).getBoundingClientRect());

    this.verseSelectService.wTagClick(wTag, verse);
  }

  async ngAfterViewInit() {}
  onScroll() {
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      // console.log(this.verses);

      await this.synchronizedScrolling().then(async () => {
        // await this.synchronizedScrolling();
      });
    }, 100);
  }

  async synchronizedScrolling(): Promise<void> {
    // const verses = document.querySelectorAll('span.verse');
    // console.log(
    //   'sync scrolling 2 ' + document.querySelectorAll('.verse').length,
    // );
    // console.log('sync scrolling ' + this.verses.length);
    // let scrollIntoView: Element;
    // let tempVerse: VerseComponent;
    // this.verses.forEach(verse => {});
    const isTop: Promise<[boolean, string]>[] = [];

    this.verses.forEach(verse => {
      isTop.push(verse.isTop());
    });
    Promise.all(isTop)
      .then(values => {
        const filter = lodash.filter(values, value => {
          return value !== null;
        });
        let lastElement =
          filter.length === 3 ? filter[1] : lodash.first(filter);

        if (lastElement) {
          console.log(lodash.mean(filter));

          document.getElementById(lastElement[1]).scrollIntoView();
          return;
        } else {
          const verseTop = lodash
            .last(document.querySelectorAll('span.verse'))
            .getBoundingClientRect().top;
          if (verseTop <= 33) {
            lodash.last(document.querySelectorAll('note')).scrollIntoView();
          } else {
            document.querySelector('note').scrollIntoView();
          }
          console.log(document.querySelector('#p1').getBoundingClientRect());
          console.log(
            lodash
              .last(document.querySelectorAll('span.verse'))
              .getBoundingClientRect(),
          );
        }
      })
      .catch(() => {
        document.querySelector('note').scrollIntoView();
      });

    // this.verses.forEach(verse => {
    //   verse
    //     .isTop()
    //     .then(value => {
    //       tempVerse = verse;
    //     })
    //     .catch(() => {
    //       if (tempVerse) {
    //         const noteID = `note${tempVerse.verse.id.substr(
    //           1,
    //           tempVerse.verse.id.length,
    //         )}`;
    //         // const noteID =
    //         //   'note' +
    //         //   (tempVerse.span.nativeElement as HTMLElement).id.substring(
    //         //     1,
    //         //     scrollIntoView.id.length,
    //         //   );
    //         document.getElementById(noteID).scrollIntoView();
    //       }
    //     });
    // });
    // this.verses.toArray().some(verse => {
    // });
    // Promise.all(isTop);
    // this.verses.toArray().forEach(verse => {
    //   const top = (verse.nativeElement as HTMLElement).getBoundingClientRect()
    //     .top;
    //   const height = (verse.nativeElement as HTMLElement).getBoundingClientRect()
    //     .height;
    //   const start = 35;
    //   if (top + height > start && top < start + height) {
    //     scrollIntoView = verse.nativeElement as HTMLElement;
    //   } else if (scrollIntoView !== undefined) {
    //     const noteID =
    //       'note' + scrollIntoView.id.substring(1, scrollIntoView.id.length);
    //     console.log('nojgtgcd' + noteID);
    //     document.getElementById(noteID).scrollIntoView();
    //     return true;
    //   }
    // });
    // this.chapterService.scrollIntoView = scrollIntoView;
    // if (scrollIntoView === undefined) {
    //   console.log(scrollIntoView);
    //   const element = verses[0];
    //   const top = element.getBoundingClientRect().top;
    //   const height = element.getBoundingClientRect().height;
    //   const start = 35;
    //   if (top + height > start) {
    //     this.scrollNotesTop();
    //   } else {
    //     this.scrollNotesBottom();
    //   }
    //   // resolve(null);
    // }
  }

  private scrollNotesBottom() {
    const notes = document.querySelectorAll('note');
    this.chapterService.scrollIntoView = notes[notes.length - 1];
    this.chapterService.scrollIntoView.scrollIntoView();
  }

  private scrollNotesTop() {
    this.chapterService.scrollIntoView = document.querySelector('note');
    this.chapterService.scrollIntoView.scrollIntoView();
  }

  private initSyncScrolling() {}
}
