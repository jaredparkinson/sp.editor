import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, QueryList } from '@angular/core';
import * as lodash from 'lodash';
// import * as PouchDB from 'pouchdb/dist/pouchdb';
import { Note } from '../models/Note';
import {
  Chapter2,
  NoteRef,
  Paragraph,
  SecondaryNote,
  Verse,
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
      chapter.notes.forEach(note => {
        note.secondary.forEach(secondaryNote => {
          noteVisibility.set(secondaryNote.id, false);
          if (this.getSecondaryNoteVisibility(secondaryNote)) {
            secondaryNote.clicked = false;
            secondaryNote.noteRefs.forEach(noteRef => {
              if (this.getNoteRefVisibility(noteRef)) {
                noteVisibility.set(secondaryNote.id, true);
              }
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

    return visible;
  }
  getNoteRefVisibility(noteRef: NoteRef): boolean {
    noteRef.visible = false;

    if (
      noteRef.referenceLabel &&
      lodash.find(this.saveState.data.noteCategories, c => {
        if (!noteRef.referenceLabel.refLabelName) {
          return true;
        }

        return (
          c.refLabelName.toLowerCase() ===
          noteRef.referenceLabel.refLabelName.toLowerCase()
        );
      }).visible
    ) {
      noteRef.visible = true;
    }

    return noteRef.visible;
  }

  buildParagraphs(paragraphs: Paragraph[], verses: Verse[]): Promise<void> {
    return new Promise<void>(resolve => {
      paragraphs.forEach(paragraph => {
        paragraph.verses = verses.slice(
          parseInt(paragraph.verseIds[0], 10) - 1,
          parseInt(paragraph.verseIds[1], 10),
        );
      });

      if (paragraphs.length === 0) {
        const ara = new Paragraph();
        ara.verses = verses;
        paragraphs.push(ara);
      }

      resolve();
    });
  }

  resetRefVisible(verses: Verse[], noteVisibility: Map<string, boolean>) {
    verses.forEach(verse => {
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
          }
        }
      });
    });
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

  public setHighlightging(verses: Verse[], highlightNumbers: [string, string]) {
    return new Promise<number>(resolve => {
      const highlight = this.parseHighlightedVerses(highlightNumbers[0]);
      const context = this.parseHighlightedVerses(highlightNumbers[1]);
      verses.forEach(verse => {
        const verseNumber = parseInt(verse.id.replace('p', ''), 10);
        verse.highlight = lodash.includes(highlight, verseNumber)
          ? true
          : false;
        verse.context = lodash.includes(context, verseNumber) ? true : false;
      });

      resolve(highlight.sort()[0]);
    });
  }

  public buildWTags(verses: Verse[], noteVisibility: Map<string, boolean>) {
    return new Promise<void>(resolve => {
      verses.forEach(verse => {
        verse.wTags.forEach(wTag => {
          wTag.text = '';
          wTag.text = verse.text.substring(
            wTag.id[0],
            lodash.last(wTag.id) + 1,
          );

          wTag.selected = false;
          wTag.clicked = false;
        });
      });
      this.resetRefVisible(verses, noteVisibility);

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
    }

    return verseNums;
  }
}
