import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, QueryList } from '@angular/core';

import * as benchmark from 'benchmark';
import * as localForage from 'localforage';
import * as lodash from 'lodash';
import { Note } from '../models/Note';
import { Chapter2 } from '../modelsJson/Chapter';
import { SecondaryNote } from '../modelsJson/SecondaryNote';
import { Verse } from '../modelsJson/Verse';
import { DataService } from './data.service';
import { HelperService } from './helper.service';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';
import { StringService } from './string.service';
import { VerseSelectService } from './verse-select.service';

@Injectable()
export class ChapterService {
  wTags: QueryList<ElementRef>;
  public selectedSecondaryNote: SecondaryNote;
  public url: string;
  constructor(
    private navService: NavigationService,
    private httpClient: HttpClient,
    private stringService: StringService,
    private saveState: SaveStateService,
    private helperService: HelperService,
    private verseSelectService: VerseSelectService,
    private dataService: DataService,
  ) {
    this.fs = (window as any).fs;
  }

  public notes2: Note[] = [];

  public verseNums: number[] = [];
  public contextNums: number[] = [];
  private fs: any;
  public wTagSelectMode = false;

  scrollIntoView: Element;

  public resetNotes(): void {
    lodash.each(this.dataService.chapter2.notes, note => {
      note.override = false;
      note.visible = this.saveState.data.secondaryNotesVisible;
    });
  }

  public async getChapter(
    book: string,
    chapter: string,
    // synchronizedScrolling: () => Promise<void>
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.verseSelectService.noteVisibility.clear();
      this.notes2 = [];
      this.navService.pageTitle = '';

      let vSplit = chapter.split('.');

      if (chapter === '') {
        vSplit = book.split('.');
      }

      // const suite = new benchmark.Suite();
      // const a = suite
      //   .add('hhj', () => {
      //   })
      //   .run();
      //   console.log(a);
      this.verseNums = this.parseHighlightedVerses2(vSplit[1]);
      this.contextNums = this.parseHighlightedVerses2(vSplit[2]);

      if (this.fs) {
        this.getChapterFS(book, vSplit).then(() => {
          resolve(null);
        });
      } else {
        this.getChapterWeb(book, vSplit).then(() => {
          resolve(null);
        });
      }
    });
  }

  private async verseFocus(): Promise<void> {
    return new Promise<void>(
      (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
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
        resolve(null);
      },
    );
  }

  private async setHighlighting(): Promise<void> {
    return new Promise<void>(
      (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        lodash.forEach(this.dataService.chapter2.paragraphs, paragraph => {
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
        resolve(null);
      },
    );
  }

  private getChapterFS(
    book: string,
    vSplit: string[],
    // synchronizedScrolling: () => Promise<void>
  ) {
    return new Promise<void>(
      (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        const url2 =
          this.navService.urlBuilder(
            book.toLowerCase(),
            vSplit[0].toLowerCase(),
          ) + '.json';

        this.fs.readFile(
          'c:/ScripturesProject/' + url2,
          'utf8',
          (err, data) => {
            this.setChapter(data);
          },
        );
        resolve(null);
      },
    );
  }

  private async getChapterWeb(
    book: string,
    vSplit: string[],
    // synchronizedScrolling: () => Promise<void>
  ) {
    return new Promise<void>(
      async (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        const saved = false; // await localForage.getItem(book + '\\' + vSplit[0]);

        if (saved) {
          this.setChapter(saved as string);
        } else {
          this.url =
            'assets/' + this.navService.urlBuilder(book, vSplit[0]) + '.json';
          const url2 =
            'assets/' + this.navService.urlBuilder(book, vSplit[0]) + '.json';

          this.httpClient
            .get(url2, {
              observe: 'body',
              responseType: 'text',
            })
            .subscribe(data => {
              this.setChapter(data);
              resolve(null);
            });
        }
      },
    );
  }

  private async setChapter(
    data: string,
    // synchronizedScrolling: () => Promise<void>
  ) {
    return new Promise<void>(
      async (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        this.dataService.chapter2 = new Chapter2();
        this.dataService.chapter2 = JSON.parse(data) as Chapter2;

        this.setHighlighting().then(() => {
          this.verseFocus().then(() => {
            // synchronizedScrolling();
            resolve(null);
          });
        });
      },
    );
  }

  public parseHighlightedVerses2(v: string): number[] {
    if (v === null || v === undefined) {
      return [];
    }
    const verseNums: number[] = [];
    if (v !== undefined) {
      const verseParams = v.split(',');

      verseParams.forEach(verseParam => {
        const t = verseParam.split('-');
        const count = t.length > 1 ? 1 : 0;
        for (let x = parseInt(t[0], 10); x <= parseInt(t[count], 10); x++) {
          verseNums.push(x);
        }
      });

      // lodash.forEach(verseParams, verseParam => {
      //   const t = verseParam.split('-');
      //   const count = t.length > 1 ? 1 : 0;
      //   for (let x = parseInt(t[0], 10); x <= parseInt(t[count], 10); x++) {
      //     verseNums.push(x);
      //   }
      // });
    }

    return verseNums;
  }
}
