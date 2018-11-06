import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, NgZone } from '@angular/core';

import { Observable } from 'rxjs';

import { DomSanitizer } from '@angular/platform-browser';
import * as localForage from 'localforage';
import * as _ from 'lodash';
import { Note } from '../models/Note';
import { Paragraph } from '../models/Paragraph';
import { Chapter2 } from '../modelsJson/Chapter';
import { Verse } from '../modelsJson/Verse';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';
import { StringService } from './string.service';

@Injectable()
export class ChapterService {
  constructor(
    private navService: NavigationService,
    private httpClient: HttpClient,
    private stringService: StringService,
    private saveState: SaveStateService
  ) {
    this.fs = (window as any).fs;
  }
  // public bodyBlock: string;
  // public notes: string;
  // public notesArray: HTMLElement[] = [];
  public notes2: Note[] = [];

  // public paragraphs: Paragraph[] = [];
  // public header: string;
  public verseNums: number[] = [];
  public contextNums: number[] = [];
  // public pageUrl = '';
  private fs: any;
  // scripturesArchive: Observable<ArrayBuffer>;
  // hebWTags: Document;
  // wTagRefs: NodeListOf<Element>;
  // verseSelect = false;
  chapter2: Chapter2 = new Chapter2();
  // wTags: Array<[string, string, string]> = [];
  scrollIntoView: Element;

  public notes: ElementRef[] = [];

  public resetNotes(): void {
    _.each(this.chapter2.notes, note => {
      note.o = false;
    });
  }

  public async getChapter(
    book: string,
    chapter: string,
    synchronizedScrolling: () => Promise<void>
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // this.paragraphs = [];
      this.notes2 = [];
      this.navService.pageTitle = '';
      // this.header = '';
      let vSplit = chapter.split('.');
      // this.hebWTags = new Document();
      if (chapter === '') {
        vSplit = book.split('.');
      }

      this.verseNums = this.parseHighlightedVerses2(vSplit[1]);
      this.contextNums = this.parseHighlightedVerses2(vSplit[2]);
      // console.log(this.verseNums + ' ' + this.contextNums);

      console.log(this.fs);

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
      console.log('asodifjaoisdfjaoisdjfoiasdjfoiasdjfoij');

      // resolve(true);
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
        _.forEach(this.chapter2.paragraphs, paragraph => {
          _.forEach(paragraph.verses, verse => {
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
        console.log(url2 + ' url2');

        this.fs.readFile(
          'c:/ScripturesProject/' + url2,
          'utf8',
          (err, data) => {
            this.setChapter(data);
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
          console.log('asved');

          this.setChapter(saved as string);
        } else {
          const url2 =
            'assets/' + this.navService.urlBuilder(book, vSplit[0]) + '.json';

          this.httpClient
            .get(url2, {
              observe: 'body',
              responseType: 'text'
            })
            .subscribe(data => {
              this.setChapter(data);
              resolve(true);
            });
        }
      }
    );
  }

  private async setChapter(data: string) {
    return new Promise<boolean>(
      async (
        resolve: (resolveValue: boolean) => void,
        reject: (rejectValue: boolean) => void
      ) => {
        this.chapter2 = JSON.parse(data) as Chapter2;
        // this.resetVerseSelect();
        this.setHighlighting().then((value: boolean) => {
          this.verseFocus().then((value2: boolean) => {
            resolve(true);
          });
        });

        console.log('verse focus');

        // resolve(true);
      }
    );
  }

  public parseHighlightedVerses2(v: string): number[] {
    // console.log('parseHighlightedVerses2');

    if (v === null || v === undefined) {
      return [];
    }
    const verseNums: number[] = [];
    if (v !== undefined) {
      const verseParams = v.split(',');

      _.forEach(verseParams, verseParam => {
        const t = verseParam.split('-');
        const count = t.length > 1 ? 1 : 0;
        for (let x = parseInt(t[0], 10); x <= parseInt(t[count], 10); x++) {
          verseNums.push(x);
        }
      });
    }

    return verseNums;
  }
  // public verses: ElementRef[] = [];

  public toggleVerseSelect() {
    this.saveState.data.verseSelect = !this.saveState.data.verseSelect;
    this.saveState.save();
    switch (this.saveState.data.verseSelect) {
      case true: {
        this.resetVerseSelect();

        break;
      }
      case false:
      default: {
        this.removeVerseSelect();

        this.resetNotes2();
        break;
      }
    }
  }
  public test(
    w: [string, string, string, string, string, string, string, string, string]
  ) {}
  public resetVerseSelect() {
    // this.verseSelected = false;
    console.log('resetVerseSelect');

    this.resetNotes2();

    this.modifyWTags(
      (
        wa: [string, string, string, string, string, string, number, string[]]
      ) => {
        wa[7] = [];

        wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-0');

        this.createRefList(wa, this.saveState.data.newNotesVisible, 3);
        this.createRefList(wa, this.saveState.data.englishNotesVisible, 4);
        this.createRefList(wa, this.saveState.data.translatorNotesVisible, 5);
        // console.log(wa[7]);

        if (wa[7].length !== 0) {
          wa[0] = this.stringService.addAttribute(wa[0], 'verse-select-0');
          wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-1');
          wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-2');
          // console.log(wa[5]);
        }
      }
    );
  }

  private createRefList(
    wa: [string, string, string, string, string, string, number, string[]],
    vis: boolean,
    noteNumber: number
  ) {
    // console.log(vis);

    if (vis) {
      (wa[noteNumber] as string).split(' ').forEach(w => {
        if (w.trim() !== '') {
          // console.log(w);

          wa[7].push(w);
        }
      });
    }
  }

  private modifyWTags(
    callBack: (
      w: [string, string, string, string, string, string, number, string[]]
    ) => void
  ) {
    _.each(this.chapter2.paragraphs, paragrah => {
      _.each(paragrah.verses, verse => {
        _.each(verse.wTags2, wa => {
          callBack(wa);
        });
      });
    });
  }

  private resetNotes2() {
    console.log('asdoifjaosid fjaosidfjaoisdjfA');

    _.each<ElementRef>(this.notes, n => {
      (n.nativeElement as HTMLElement).classList.remove('verse-select-1');
    });
    // _.each(this.chapterService.notes2, note => {
    //   note.resetVerseSelect();
    // });
  }

  public removeVerseSelect() {
    this.modifyWTags(
      (
        wa: [string, string, string, string, string, string, number, string[]]
      ) => {
        for (let x = 0; x < 10; x++) {
          wa[0] = this.stringService.removeAttribute(
            wa[0],
            'verse-select-' + x
          );
        }
      }
    );

    // _.each(this.chapterService.wTags, wTag => {
    //   wTag[0] = wTag[0].replace(' verse-select-0', '');
    // });
  }

  public wTagClick(
    w: [string, string, string, string, string, string, number, string[]],
    verse: Verse
  ) {
    // console.log(this.saveState.data.verseSelect);

    if (
      w[7].length === 0 &&
      !this.stringService.hasAttribute(w[0], 'verse-select-2') &&
      !this.stringService.hasAttribute(w[0], 'verse-select-1')
    ) {
      return;
    }
    if (this.saveState.data.verseSelect) {
      // console.log('asodifj');

      if (this.stringService.hasAttribute(w[0], 'verse-select-0')) {
        this.firstClick(w, verse);
      } else if (this.stringService.hasAttribute(w[0], 'verse-select-1')) {
        this.resetVerseSelect();
      } else if (this.stringService.hasAttribute(w[0], 'verse-select-2')) {
        // console.log('asdfasdfasdfasdfasdf');
        this.selectNote(w);
      }
    }
  }
  resetVerseSelect1(): void {
    this.modifyWTags(
      (
        wa: [string, string, string, string, string, string, number, string[]]
      ) => {
        if (wa[3].trim() !== '') {
          wa[0] = this.stringService.addAttribute(wa[0], 'verse-select-0');
          wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-1');
        }
        if (wa[4].trim() !== '') {
          wa[0] = this.stringService.addAttribute(wa[0], 'verse-og-select-0');
          wa[0] = this.stringService.removeAttribute(
            wa[0],
            'verse-og-select-1'
          );
        }
        if (wa[5].trim() !== '') {
          wa[0] = this.stringService.addAttribute(wa[0], 'verse-tc-select-0');
          wa[0] = this.stringService.removeAttribute(
            wa[0],
            'verse-tc-select-1'
          );
        }
      }
    );
  }

  private firstClick(
    w: [string, string, string, string, string, string, number, string[]],
    verse: Verse
  ) {
    this.resetVerseSelect();
    // this.verseSelected = true;
    // console.log(w[7]);
    verse.wTags2.forEach(wr => {
      // console.log(wr);

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
    this.selectNote(w);
  }

  private refCount(refs: string): number {
    return refs.split(' ').length;
  }
  private selectNote(
    wTag: [string, string, string, string, string, string, number, string[]]
  ) {
    // console.log(wTag[7].length);
    this.resetNotes2();
    if (wTag[7].length === 0) {
      // console.log(wTag[7]);

      this.resetVerseSelect();
      return;
    }
    const note = _.find(this.notes, (n: ElementRef) => {
      return (n.nativeElement as HTMLElement).id === wTag[7][0];
    });
    wTag[7].shift();
    console.log(note);

    if (note) {
      (note.nativeElement as HTMLElement).classList.add('verse-select-1');
      (note.nativeElement as HTMLElement).scrollIntoView({
        block: 'center'
      });
    } else {
      this.resetVerseSelect();
    }
  }
}
