import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, QueryList } from '@angular/core';
import * as lodash from 'lodash';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import { Note } from '../models/Note';
import {
  Chapter2,
  Paragraph,
  Verse,
  W,
  SecondaryNote,
  Paragraphs,
  Verses,
  NoteRef,
} from '../modelsJson/Chapter';
import { DatabaseService } from './database.service';
import { EditService } from './EditService';
import { HelperService } from './helper.service';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';
import { StringService } from './string.service';
import { VerseSelectService } from './verse-select.service';
import { DataService } from './data.service';
@Injectable()
export class ChapterService {
  constructor(
    private navService: NavigationService,
    private httpClient: HttpClient,
    private stringService: StringService,
    private saveState: SaveStateService,
    private helperService: HelperService,
    private verseSelectService: VerseSelectService,
    private editService: EditService,
    private dataBaseService: DatabaseService,
    private dataService: DataService,
  ) {
    this.fs = (window as any).fs;
  }
  wTags: QueryList<ElementRef>;
  public selectedSecondaryNote: SecondaryNote;
  public url: string;
  public db = new PouchDB('alpha.oneinthinehand.org');

  public notes2: Note[] = [];

  public verseNums: number[] = [];
  public contextNums: number[] = [];
  private fs: any;
  public wTagSelectMode = false;

  scrollIntoView: Element;

  resetNoteVisibility(
    chapter: Chapter2,
    noteVisibility: Map<string, boolean>,
  ): Promise<void> {
    return new Promise<void>((resolve: (resolveValue: void) => void) => {
      // const noteVisibility: Map<string, boolean> = new Map();
      chapter.notes.notes.forEach(note => {
        note.secondary.forEach(secondaryNote => {
          noteVisibility.set(secondaryNote.id, false);
          if (this.getSecondaryNoteVisibility(secondaryNote)) {
            secondaryNote.noteRefs.forEach(noteRef => {
              if (this.getNoteRefVisibility(noteRef)) {
                noteVisibility.set(secondaryNote.id, true);
              }
              // console.log(noteRef.referenceLabel);
            });
          }
        });
      });
      resolve();
    });
  }
  getSecondaryNoteVisibility(secondaryNote: SecondaryNote): boolean {
    let visible = false;

    if (
      (this.saveState.data.newNotesVisible &&
        (secondaryNote.notePhrase.classList.includes('note-phrase-new') ||
          secondaryNote.notePhrase.classList.includes('note-phrase-new-2'))) ||
      (this.saveState.data.translatorNotesVisible &&
        (secondaryNote.notePhrase.classList.includes('note-phrase-tc') ||
          secondaryNote.notePhrase.classList.includes('note-phrase-tc-2'))) ||
      (this.saveState.data.englishNotesVisible &&
        (secondaryNote.notePhrase.classList.includes('note-phrase-eng') ||
          secondaryNote.notePhrase.classList.includes('note-phrase-eng-2')))
    ) {
      visible = true;
    }

    if (
      !this.saveState.data.secondaryNotesVisible &&
      (secondaryNote.notePhrase.classList.includes('note-phrase-new-2') ||
        secondaryNote.notePhrase.classList.includes('note-phrase-tc-2') ||
        secondaryNote.notePhrase.classList.includes('note-phrase-eng-2'))
    ) {
      visible = false;
    }
    // if (visible) {
    //   console.log(
    //     visible +
    //       ' ' +
    //       secondaryNote.notePhrase.text +
    //       ' ' +
    //       secondaryNote.notePhrase.classList,
    //   );
    // }

    return visible;
  }
  getNoteRefVisibility(noteRef: NoteRef): boolean {
    // console.log(noteRef.referenceLabel.refLabelName);
    noteRef.visible = false;

    if (
      (noteRef.referenceLabel.refLabelName === 'quotation' &&
        this.saveState.data.refQUO) ||
      (noteRef.referenceLabel.refLabelName === 'phrasing' &&
        this.saveState.data.refPHR) ||
      (noteRef.referenceLabel.refLabelName === 'or' &&
        this.saveState.data.refOR) ||
      (noteRef.referenceLabel.refLabelName === 'ie' &&
        this.saveState.data.refIE) ||
      (noteRef.referenceLabel.refLabelName === 'hebrew' &&
        this.saveState.data.refHEB) ||
      (noteRef.referenceLabel.refLabelName === 'greek' &&
        this.saveState.data.refGR) ||
      (noteRef.referenceLabel.refLabelName === 'archaic' &&
        this.saveState.data.refKJV) ||
      (noteRef.referenceLabel.refLabelName === 'historical' &&
        this.saveState.data.refHST) ||
      (noteRef.referenceLabel.refLabelName === 'cr' &&
        this.saveState.data.refCR) ||
      (noteRef.referenceLabel.refLabelName === 'alt' &&
        this.saveState.data.refALT) ||
      (noteRef.referenceLabel.refLabelName === 'harmony' &&
        this.saveState.data.refHMY) ||
      (noteRef.referenceLabel.refLabelName === 'tg' &&
        this.saveState.data.refTG) ||
      (noteRef.referenceLabel.refLabelName === 'gs' &&
        this.saveState.data.refGS)
    ) {
      // console.log('gtcrd');
      noteRef.visible = true;
    }
    // console.log(`${noteRef.referenceLabel.refLabelName} ${visibile}`);

    return noteRef.visible;
  }

  buildParagraphs(paragraphs: Paragraphs, verses: Verses): Promise<void> {
    return new Promise<void>(resolve => {
      // const paragraphs = lodash.cloneDeep(chapter.paragraphs);

      paragraphs.paragraphs.forEach(paragraph => {
        paragraph.verses = [];
        paragraph.verseIds.forEach(verseId => {
          paragraph.verses.push(
            lodash.find(verses.verses, verse => {
              return verse.id === verseId;
            }),
          );
        });
      });
      console.log(paragraphs);
      paragraphs.paragraphs[0].verseIds.push('d');

      resolve();
    });
  }

  public resetNotes(): void {
    lodash.each(this.dataService.chapter2.notes, note => {
      // note.override = false;
      // note.visible = this.saveState.data.secondaryNotesVisible;
    });
  }

  resetRefVisible(verses: Verses, noteVisibility: Map<string, boolean>) {
    verses.verses.forEach(verse => {
      verse.wTags.forEach(wTag => {
        if (wTag.refs) {
          wTag.visibleRefs = [];
          wTag.refs.forEach(ref => {
            if (noteVisibility.get(ref)) {
              wTag.visibleRefs.push(ref);
            }
          });
        }
      });
    });

    // const engRegex = new RegExp(/\d{9}/g);
    // const newRegex = new RegExp(/\d{4}(\-\d{2}){6}/g);
    // const tcRegex = new RegExp(/tc.*/g);

    // const regex: RegExp[] = [];

    // if (this.saveState.data.englishNotesVisible) {
    //   regex.push(engRegex);
    // }
    // if (this.saveState.data.newNotesVisible) {
    //   regex.push(newRegex);
    // }
    // if (this.saveState.data.translatorNotesVisible) {
    //   regex.push(tcRegex);
    // }

    // verses.verses.forEach(verse => {
    //   // lodash.filter(verse.wTags,( wTag as W) => {
    //   //   wTag
    //   //   let vis = false;
    //   //   regex.forEach(r => {
    //   //     if (r.test(wTag)) {
    //   //       vis = true;
    //   //     }
    //   //   })
    //   // } )
    //   verse.wTags.forEach(wTag => {
    //     if (wTag.refs) {
    //       wTag.visibleRefs = [];

    //       wTag.refs.forEach(id => {
    //         regex.forEach(r => {
    //           if (r.test(id.toString())) {
    //             // console.log(id);

    //             wTag.visibleRefs.push(id);
    //           }
    //         });
    //       });
    //     }
    //   });
    // });
  }

  public getChapter(id: string) {
    return new Promise<Chapter2>(
      (
        resolve: (resolveValue: Chapter2) => void,
        reject: (rejectValue: Chapter2) => void,
      ) => {
        this.dataBaseService
          .get(id)
          .then(chapter => {
            resolve(chapter as Chapter2);
          })
          .catch(() => {
            reject(undefined);
          });
      },
    );
  }

  public setHighlightging(
    chapter: Chapter2,
    highlightNumbers: [string, string],
  ) {
    return new Promise<Chapter2>(resolve => {
      console.log(this.parseHighlightedVerses(highlightNumbers[0]));
      console.log(this.parseHighlightedVerses(highlightNumbers[1]));

      const highlight = this.parseHighlightedVerses(highlightNumbers[0]);
      const context = this.parseHighlightedVerses(highlightNumbers[1]);
      chapter.verses.verses.forEach(verse => {
        // console.log(verse);

        const verseNumber = parseInt(verse.id.replace('p', ''), 10);
        verse.highlight = lodash.includes(highlight, verseNumber)
          ? true
          : false;
        verse.context = lodash.includes(context, verseNumber) ? true : false;
        // if (!lodash.includes(highlight, verseNumber)) {
        //   console.log(verse);
        // }
        // if (!lodash.includes(context, verseNumber)) {
        //   console.log(verse);
        // }
      });
      resolve(chapter);
    });
  }

  public buildWTags(verses: Verses, noteVisibility: Map<string, boolean>) {
    return new Promise<void>(resolve => {
      verses.verses.forEach(verse => {
        verse.wTags.forEach(wTag => {
          wTag.text = '';
          wTag.id.forEach(i => {
            wTag.text = `${wTag.text}${verse.text[i]}`;
          });
          wTag.selected = false;
          wTag.clicked = false;
          // console.log(wTag.text);
        });

        this.resetRefVisible(verses, noteVisibility);
        // let start: number = null;
        // let end: number = null;
        // const tempWad: W[] = [];
        // verse.wTags.forEach(w => {
        //   w.text = '';
        //   w.text = this.getWTagText(w.id, verse.text);
        //   tempWad.push(w);
        //   if (!start) {
        //     start = lodash.last(w.id) + 1;
        //   } else {
        //     const tempW = new W('');
        //     end = lodash.first(w.id);
        //     if (lodash.last(verse.wTags) === w) {
        //       start = lodash.last(w.id) + 1;
        //       end = verse.text.length;
        //       // console.log(start);
        //       console.log(end);
        //     }
        //     for (let x = start; x < end; x++) {
        //       tempW.id.push(x);
        //     }
        //     tempW.text = this.getWTagText(tempW.id, verse.text);
        //     tempWad.push(tempW);
        //     start = null;
        //   }
        // });
        // console.log('tempasdf');
        // console.log(tempWad);

        // let newWTags: W[] = [];

        // let tempWTagText = '';
        // let y = 0;
        // for (let x = 0; x < verse.text.length; x++) {
        //   const character = verse.text[x];
        //   // console.log(character);
        //   if (y < verse.wTags.length && verse.wTags[y].id.includes(x)) {
        //     verse.wTags[y].text += character;
        //     if (tempWTagText.length > 0) {
        //       newWTags.push(new W(`${tempWTagText}${character}`));
        //       tempWTagText = '';
        //     }
        //     continue;
        //   }
        //   if (y < verse.wTags.length && lodash.last(verse.wTags[y].id) < x) {
        //     newWTags.push(verse.wTags[y]);
        //     y = y + 1;
        //     continue;
        //   }
        //   if (y < verse.wTags.length && lodash.first(verse.wTags[y].id) > x) {
        //     tempWTagText = `${tempWTagText}${character}`;
        //   }
        // }

        // verse.builtWTags = tempWad;
        // console.log(newWTags);
      });
      resolve();
    });
  }
  getWTagText(id: number[], text: string): string {
    let tempText = '';
    id.forEach(i => {
      tempText = `${tempText}${text[i]}`;
    });
    return tempText;
  }

  public async getChapterOld(
    id: string,
    // synchronizedScrolling: () => Promise<void>
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.verseSelectService.noteVisibility.clear();
      this.notes2 = [];
      this.navService.pageTitle = '';

      // let vSplit = chapter.split('.');

      // if (chapter === '') {
      //   vSplit = book.split('.');
      // }

      // const suite = new benchmark.Suite();
      // const a = suite
      //   .add('hhj', () => {
      //   })
      //   .run();
      //   console.log(a);
      // this.verseNums = this.parseHighlightedVerses2(vSplit[1]);
      // this.contextNums = this.parseHighlightedVerses2(vSplit[2]);
      this.getChapterWeb(id).then(() => {
        resolve(undefined);
      });
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
          console.log('verseFocus');

          resolve(null);
        });
      },
    );
  }

  private async oldSetHighlighting(): Promise<void> {
    return new Promise<void>(
      (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        // lodash.forEach(this.dataService.chapter2.paragraphs, paragraph => {
        //   lodash.forEach(paragraph.verses, verse => {
        //     if (this.verseNums.includes(parseInt(verse.id.split('p')[1], 10))) {
        //       verse.highlight = true;
        //     }
        //     if (
        //       this.contextNums.includes(parseInt(verse.id.split('p')[1], 10))
        //     ) {
        //       verse.context = true;
        //     }
        //   });
        // });
        resolve(null);
      },
    );
  }

  private async getChapterWeb(
    id: string,
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
          console.log();
          this.dataBaseService.get(`${id}`).then(value => {
            console.log(value as Chapter2);

            this.setChapter(value as string).then(() => {
              resolve(null);
            });
          });

          // this.url =
          //   'https://storage.oneinthinehand.org/alpha/' +
          //   this.navService.urlBuilder(book, vSplit[0]) +
          //   '.json';
          // const url2 =
          //   'https://storage.oneinthinehand.org/alpha/' +
          //   this.navService.urlBuilder(book, vSplit[0]) +
          //   '.json';

          // this.httpClient
          //   .get(url2, {
          //     observe: 'body',
          //     responseType: 'text',
          //   })
          //   .subscribe(data => {
          //     // console.log(data);
          //     // this.db.put(JSON.parse(data));

          //     this.setChapter(data).then(() => {
          //       resolve(null);
          //     });
          //   });
        }
      },
    );
  }

  private async setChapter(
    data: {},
    // synchronizedScrolling: () => Promise<void>
  ) {
    return new Promise<void>(
      async (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        this.dataService.chapter2 = new Chapter2();
        this.dataService.chapter2 = data as Chapter2;

        this.oldSetHighlighting().then(() => {
          this.verseFocus().then(() => {
            // synchronizedScrolling();
            resolve(null);
          });
        });
      },
    );
  }

  public parseHighlightedVerses(v: string): number[] {
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
