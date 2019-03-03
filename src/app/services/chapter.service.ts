import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, QueryList } from '@angular/core';
import * as lodash from 'lodash';
// import * as PouchDB from 'pouchdb/dist/pouchdb';
import { Note } from '../models/Note';
import {
  Chapter2,
  NoteRef,
  Paragraph,
  Paragraphs,
  SecondaryNote,
  Verse,
  Verses,
  W,
} from '../modelsJson/Chapter';
import { DataService } from './data.service';
import { DatabaseService } from './database.service';
import { EditService } from './EditService';
import { HelperService } from './helper.service';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';
import { StringService } from './string.service';
import { VerseSelectService } from './verse-select.service';
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

  public resetNotes(): Promise<void> {
    return new Promise<void>(resolve => {
      console.log('test');

      this.resetNoteVisibility(
        this.dataService.chapter2,
        this.dataService.noteVisibility,
      ).then(() => {
        this.buildWTags(
          this.dataService.verses,
          this.dataService.noteVisibility,
        ).then(() => {
          resolve();
        });
      });
    });
  }
  resetNoteVisibility(
    chapter: Chapter2,
    noteVisibility: Map<string, boolean>,
  ): Promise<void> {
    return new Promise<void>(resolve => {
      // const noteVisibility: Map<string, boolean> = new Map();
      chapter.notes.notes.forEach(note => {
        note.secondary.forEach(secondaryNote => {
          noteVisibility.set(secondaryNote.id, false);
          if (this.getSecondaryNoteVisibility(secondaryNote)) {
            secondaryNote.clicked = false;
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
      noteRef.referenceLabel &&
      lodash.find(this.saveState.data.noteCategories, c => {
        // console.log(noteRef);

        if (!noteRef.referenceLabel.refLabelName) {
          return true;
        }

        return (
          c.refLabelName.toLowerCase() ===
          noteRef.referenceLabel.refLabelName.toLowerCase()
        );
      }).visible
      // (noteRef.referenceLabel.refLabelName === 'quotation' &&
      //   this.saveState.data.refQUO) ||
      // (noteRef.referenceLabel.refLabelName === 'phrasing' &&
      //   this.saveState.data.refPHR) ||
      // (noteRef.referenceLabel.refLabelName === 'or' &&
      //   this.saveState.data.refOR) ||
      // (noteRef.referenceLabel.refLabelName === 'ie' &&
      //   this.saveState.data.refIE) ||
      // (noteRef.referenceLabel.refLabelName === 'hebrew' &&
      //   this.saveState.data.refHEB) ||
      // (noteRef.referenceLabel.refLabelName === 'greek' &&
      //   this.saveState.data.refGR) ||
      // (noteRef.referenceLabel.refLabelName === 'archaic' &&
      //   this.saveState.data.refKJV) ||
      // (noteRef.referenceLabel.refLabelName === 'historical' &&
      //   this.saveState.data.refHST) ||
      // (noteRef.referenceLabel.refLabelName === 'cr' &&
      //   this.saveState.data.refCR) ||
      // (noteRef.referenceLabel.refLabelName === 'alt' &&
      //   this.saveState.data.refALT) ||
      // (noteRef.referenceLabel.refLabelName === 'harmony' &&
      //   this.saveState.data.refHMY) ||
      // (noteRef.referenceLabel.refLabelName === 'tg' &&
      //   this.saveState.data.refTG) ||
      // (noteRef.referenceLabel.refLabelName === 'gs' &&
      //   this.saveState.data.refGS)
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

      if (paragraphs.paragraphs.length === 0) {
        const ara = new Paragraph();
        ara.verses = verses.verses;
        paragraphs.paragraphs.push(ara);
      }
      // console.log(paragraphs);
      // paragraphs.paragraphs[0].verseIds.push('d');

      resolve();
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
          if (wTag.visibleRefs.length === 0) {
            wTag.visibleRefs = undefined;
          } else {
            wTag.visibleRefs = wTag.visibleRefs.sort(
              (a: string, b: string): number => {
                return this.getSortingKey(a) - this.getSortingKey(b);
              },
            );
            wTag.visibleRefCount = wTag.visibleRefs.length;
            // console.log(wTag.visibleRefCount);
          }
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
  getSortingKey(b: string): number {
    const engRegex = new RegExp(/\d{9}/g);
    const newRegex = new RegExp(/\d{4}(\-\d{2}){6}/g);
    const tcRegex = new RegExp(/tc.*/g);

    if (engRegex.test(b)) {
      return 2;
    }
    if (newRegex.test(b)) {
      return 3;
    }
    if (tcRegex.test(b)) {
      return 1;
    }
    return 4;
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

  public setHighlightging(verses: Verses, highlightNumbers: [string, string]) {
    return new Promise<number>(resolve => {
      // console.log(this.parseHighlightedVerses(highlightNumbers[0]));
      // console.log(this.parseHighlightedVerses(highlightNumbers[1]));

      const highlight = this.parseHighlightedVerses(highlightNumbers[0]);
      const context = this.parseHighlightedVerses(highlightNumbers[1]);
      verses.verses.forEach(verse => {
        // console.log(verse);

        const verseNumber = parseInt(verse.id.replace('p', ''), 10);
        verse.highlight = lodash.includes(highlight, verseNumber)
          ? true
          : false;
        verse.context = lodash.includes(context, verseNumber) ? true : false;



        if (verse.context) {
          console.log(verse.id);
          console.log(context);
        }
        // if (!lodash.includes(highlight, verseNumber)) {pn
        //   console.log(verse);
        // }
        // if (!lodash.includes(context, verseNumber)) {
        //   console.log(verse);
        // }
      });
      // console.log();
      
      resolve(highlight.sort()[0]);
    });
  }

  public buildWTags(verses: Verses, noteVisibility: Map<string, boolean>) {
    return new Promise<void>(resolve => {
      verses.verses.forEach(verse => {
        verse.wTags.forEach(wTag => {
          wTag.text = '';
          wTag.text = verse.text.substring(
            wTag.id[0],
            lodash.last(wTag.id) + 1,
          );
          // wTag.id.forEach(i => {
          //   wTag.text = `${wTag.text}${verse.text[i]}`;
          // });
          wTag.selected = false;
          wTag.clicked = false;
          // console.log(wTag.text);
        });
      });
      this.resetRefVisible(verses, noteVisibility);
      console.log('aasdf');

      resolve(undefined);
    });
  }
  getWTagText(id: number[], text: string): string {
    let tempText = '';
    id.forEach(i => {
      tempText = `${tempText}${text[i]}`;
    });
    return tempText;
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
