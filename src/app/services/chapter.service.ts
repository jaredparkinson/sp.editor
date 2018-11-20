import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, QueryList } from '@angular/core';

import * as localForage from 'localforage';
import * as lodash from 'lodash';
import { Note } from '../models/Note';
import { Chapter2 } from '../modelsJson/Chapter';
import { Verse } from '../modelsJson/Verse';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';
import { StringService } from './string.service';

@Injectable()
export class ChapterService {
  wTags: QueryList<ElementRef>;
  constructor(
    private navService: NavigationService,
    private httpClient: HttpClient,
    private stringService: StringService,
    private saveState: SaveStateService
  ) {
    this.fs = (window as any).fs;
  }

  public notes2: Note[] = [];

  public verseNums: number[] = [];
  public contextNums: number[] = [];

  private fs: any;

  chapter2: Chapter2 = new Chapter2();

  scrollIntoView: Element;

  public notes: ElementRef[] = [];

  public resetNotes(): void {
    lodash.each(this.chapter2.notes, note => {
      note.o = false;
    });
  }

  public async getChapter(
    book: string,
    chapter: string,
    synchronizedScrolling: () => Promise<void>
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.notes2 = [];
      this.navService.pageTitle = '';

      let vSplit = chapter.split('.');

      if (chapter === '') {
        vSplit = book.split('.');
      }

      this.verseNums = this.parseHighlightedVerses2(vSplit[1]);
      this.contextNums = this.parseHighlightedVerses2(vSplit[2]);

      if (this.fs) {
        this.getChapterFS(book, vSplit, synchronizedScrolling).then(
          (value: boolean) => {
            resolve(true);
          }
        );
      } else {
        this.getChapterWeb(book, vSplit, synchronizedScrolling).then(
          (value: boolean) => {
            resolve(true);
          }
        );
      }
    });
  }

  private async verseFocus(): Promise<boolean> {
    return new Promise<boolean>(
      (
        resolve: (resolveValue: boolean) => void,
        reject: (rejectValue: boolean) => void
      ) => {
        setTimeout(() => {
          if (this.verseNums.length === 0) {
            document.getElementById('bodyBlockTop').scrollIntoView();
          } else {
            const focusVerse = this.contextNums
              .concat(this.verseNums)
              .sort((a, b) => {
                return a - b;
              })[0]
              .toString();
            document.getElementById('p' + focusVerse).scrollIntoView();
          }
        });
        resolve(true);
      }
    );
  }

  private async setHighlighting(): Promise<boolean> {
    return new Promise<boolean>(
      (
        resolve: (resolveValue: boolean) => void,
        reject: (rejectValue: boolean) => void
      ) => {
        lodash.forEach(this.chapter2.paragraphs, paragraph => {
          lodash.forEach(paragraph.verses, verse => {
            if (this.verseNums.includes(parseInt(verse.id.split('p')[1], 10))) {
              verse.highlight = true;
            }
            if (
              this.contextNums.includes(parseInt(verse.id.split('p')[1], 10))
            ) {
              verse.context = true;
            }
          });
        });
        resolve(true);
      }
    );
  }

  private getChapterFS(
    book: string,
    vSplit: string[],
    synchronizedScrolling: () => Promise<void>
  ) {
    return new Promise<boolean>(
      (
        resolve: (resolveValue: boolean) => void,
        reject: (rejectValue: boolean) => void
      ) => {
        const url2 =
          this.navService.urlBuilder(
            book.toLowerCase(),
            vSplit[0].toLowerCase()
          ) + '.json';

        this.fs.readFile(
          'c:/ScripturesProject/' + url2,
          'utf8',
          (err, data) => {
            this.setChapter(data, synchronizedScrolling);
          }
        );
        resolve(true);
      }
    );
  }

  private async getChapterWeb(
    book: string,
    vSplit: string[],
    synchronizedScrolling: () => Promise<void>
  ) {
    return new Promise<boolean>(
      async (
        resolve: (resolveValue: boolean) => void,
        reject: (rejectValue: boolean) => void
      ) => {
        const saved = await localForage.getItem(book + '\\' + vSplit[0]);

        if (saved) {
          this.setChapter(saved as string, synchronizedScrolling);
        } else {
          const url2 =
            'assets/' + this.navService.urlBuilder(book, vSplit[0]) + '.json';

          this.httpClient
            .get(url2, {
              observe: 'body',
              responseType: 'text'
            })
            .subscribe(data => {
              this.setChapter(data, synchronizedScrolling);
              resolve(true);
            });
        }
      }
    );
  }

  private async setChapter(
    data: string,
    synchronizedScrolling: () => Promise<void>
  ) {
    return new Promise<boolean>(
      async (
        resolve: (resolveValue: boolean) => void,
        reject: (rejectValue: boolean) => void
      ) => {
        this.chapter2 = JSON.parse(data) as Chapter2;

        this.setHighlighting().then((value: boolean) => {
          this.verseFocus().then((value2: boolean) => {
            // synchronizedScrolling();
            resolve(true);
          });
        });
      }
    );
  }

  public parseHighlightedVerses2(v: string): number[] {
    if (v === null || v === undefined) {
      return [];
    }
    const verseNums: number[] = [];
    if (v !== undefined) {
      const verseParams = v.split(',');

      lodash.forEach(verseParams, verseParam => {
        const t = verseParam.split('-');
        const count = t.length > 1 ? 1 : 0;
        for (let x = parseInt(t[0], 10); x <= parseInt(t[count], 10); x++) {
          verseNums.push(x);
        }
      });
    }

    return verseNums;
  }

  public toggleVerseSelect(toggle: boolean = this.saveState.data.verseSelect) {
    this.saveState.data.verseSelect = toggle;
    this.saveState.save();
    this.resetVerseSelect();
  }
  public toggleVerseSuperScripts(
    toggle: boolean = this.saveState.data.verseSuperScripts
  ) {
    this.saveState.data.verseSuperScripts = !this.saveState.data
      .verseSuperScripts;
    this.saveState.save();
    this.resetVerseSelect();
  }

  public modifyWTag(callback: (elem: Element) => void) {
    this.wTags.forEach(e => {
      callback(e.nativeElement as Element);
    });
  }

  public resetVerseNotes(
    wTag: [
      string,
      string,
      string,
      string,
      string,
      string,
      number,
      string[],
      boolean
    ] = null
  ) {
    this.resetNotes2();
    this.resetVerseSelect(wTag);
  }

  public resetVerseSelect(
    wTag: [
      string,
      string,
      string,
      string,
      string,
      string,
      number,
      string[],
      boolean
    ] = null
  ) {
    this.modifyWTags(
      (
        wa: [
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
      ) => {
        if (wa !== wTag) {
          wa[7] = [];

          wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-0');
          wa[0] = this.stringService.removeAttribute(wa[0], 'note-select-1');
          wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-1');
          if (true) {
            this.createRefList(wa, this.saveState.data.newNotesVisible, 3);
            this.createRefList(wa, this.saveState.data.englishNotesVisible, 4);
            this.createRefList(
              wa,
              this.saveState.data.translatorNotesVisible,
              5
            );

            if (wa[7].length !== 0) {
              wa[0] = this.stringService.addAttribute(wa[0], 'verse-select-0');
              wa[0] = this.stringService.removeAttribute(
                wa[0],
                'verse-select-1'
              );

              wa[0] = this.stringService.removeAttribute(
                wa[0],
                'verse-select-2'
              );
            }
          }
        }
      }
    );
  }

  private createRefList(
    wa: [
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
    vis: boolean,
    noteNumber: number
  ) {
    if (vis) {
      (wa[noteNumber] as string).split(',').forEach(w => {
        if (w.trim() !== '') {
          if (
            (w.includes('-t2') && this.saveState.data.secondaryNotesVisible) ||
            !w.includes('-t2')
          ) {
            wa[7].push(w);
          }
        }
      });
      wa[8] = wa[7].length > 1;
    }
  }

  public modifyWTags(
    callBack: (
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
    ) => void
  ) {
    lodash.each(this.chapter2.paragraphs, paragrah => {
      lodash.each(paragrah.verses, verse => {
        lodash.each(verse.wTags2, wa => {
          callBack(wa);
        });
      });
    });
  }

  public resetNotes2() {
    lodash.each<ElementRef>(this.notes, n => {
      (n.nativeElement as HTMLElement).classList.remove('verse-select-1');
    });
  }

  public wTagClick(
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
    verse: Verse
  ) {
    // console.log(w[3].split(','));

    if (
      w[7].length === 0 &&
      !this.stringService.hasAttribute(w[0], 'verse-select-2') &&
      !this.stringService.hasAttribute(w[0], 'verse-select-1')
    ) {
      return;
    }
    if (this.stringService.hasAttribute(w[0], 'verse-select-0')) {
      this.firstClick(w, verse);
    } else if (this.stringService.hasAttribute(w[0], 'verse-select-1')) {
      this.resetVerseNotes();
    } else if (this.stringService.hasAttribute(w[0], 'verse-select-2')) {
      this.selectNote(verse, w);
    }
    // if (this.saveState.data.verseSelect) {
    // }
  }
  private firstClick(
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
    verse: Verse
  ) {
    this.resetVerseSelect();
    // console.log(w[7]);

    this.highlightRelatedWords(verse, w);
    this.selectNote(verse, w, false);
  }

  private highlightRelatedWords(
    verse: Verse,
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
    verse.wTags2.forEach(wr => {
      w[7].forEach(ref => {
        if (wr[7].includes(ref) && wr[7].length >= 1) {
          wr[0] = this.stringService.removeAttribute(wr[0], 'verse-select-0');
          wr[0] =
            wr[7].length > 1
              ? this.stringService.addAttribute(wr[0], 'verse-select-2')
              : this.stringService.addAttribute(wr[0], 'verse-select-1');
        }
      });
    });
  }

  private selectNote(
    verse: Verse,
    wTag: [
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
    resetVerse: boolean = true
  ) {
    this.resetNotes2();
    if (wTag[7].length === 0) {
      this.resetVerseNotes();
      return;
    }
    const note = lodash.find(this.notes, (n: ElementRef) => {
      return (n.nativeElement as HTMLElement).id === wTag[7][0];
    });

    if (note) {
      (note.nativeElement as HTMLElement).classList.add('verse-select-1');
      (note.nativeElement as HTMLElement).scrollIntoView({
        block: 'center'
      });

      if (resetVerse) {
        this.resetVerseSelect(wTag);
        this.highlightRelatedWords(verse, wTag);
      }

      wTag[7].shift();
    } else {
      this.resetVerseNotes();
    }
  }
}
