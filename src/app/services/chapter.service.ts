import { Injectable } from '@angular/core';
import * as lodash from 'lodash';
import { Chapter2 } from '../modelsJson/Chapter';
import { NoteRef } from '../modelsJson/NoteRef';
import { Paragraph } from '../modelsJson/Paragraph';
import { SecondaryNote } from '../modelsJson/SecondaryNote';
import { Verse } from '../modelsJson/Verse';
import { DataService } from './data.service';
import { DatabaseService } from './database.service';
import { SaveStateService } from './save-state.service';

@Injectable()
export class ChapterService {
  constructor(
    private saveState: SaveStateService,
    private dataBaseService: DatabaseService,
    private dataService: DataService,
  ) {}

  public chapterFadeOut = false;

  public resetNotes(): Promise<void> {
    return new Promise<void>(async resolve => {
      await this.resetNoteVisibility(
        this.dataService.chapter2,
        this.dataService.noteVisibility,
      );
      await this.buildWTags(
        this.dataService.verses,
        this.dataService.noteVisibility,
      );
      resolve();
    });
  }
  resetNoteVisibility(
    chapter: Chapter2,
    noteVisibility: Map<string, boolean>,
  ): Promise<void> {
    return new Promise<void>(resolve => {
      lodash
        .map(chapter.notes, note => {
          return note.secondary;
        })
        .forEach(s => {
          s.forEach(secondaryNote => {
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
      this.noteTypeVisible(
        secondaryNote,
        this.saveState.data.newNotesVisible,
        'note-phrase-new',
      ) ||
      this.noteTypeVisible(
        secondaryNote,
        this.saveState.data.translatorNotesVisible,
        'note-phrase-tc',
      ) ||
      this.noteTypeVisible(
        secondaryNote,
        this.saveState.data.englishNotesVisible,
        'note-phrase-eng',
      )
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
  private noteTypeVisible(
    secondaryNote: SecondaryNote,
    noteVisible: boolean,
    className: string,
  ) {
    return (
      noteVisible &&
      lodash.includes(secondaryNote.notePhrase.classList, className)
    );
  }

  getNoteRefVisibility(noteRef: NoteRef): boolean {
    noteRef.visible = false;

    if (
      !noteRef.referenceLabel ||
      (noteRef.referenceLabel &&
        lodash.find(this.saveState.data.noteCategories, c => {
          if (!noteRef.referenceLabel.refLabelName) {
            return true;
          }

          return (
            c.refLabelName.toLowerCase() ===
            noteRef.referenceLabel.refLabelName.toLowerCase()
          );
        }).visible)
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
      this.setRefVisibility(verse, noteVisibility);
    });
  }

  private setRefVisibility(verse: Verse, noteVisibility: Map<string, boolean>) {
    if (verse) {
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
            wTag.visibleRefs = lodash.reverse(wTag.visibleRefs);
            wTag.visibleRefCount = wTag.visibleRefs.length;
          }
        }
      });
    }
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

      resolve(lodash.sortBy(highlight)[0]);
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
