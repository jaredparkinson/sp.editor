import { Injectable } from '@angular/core';
import { Chapter2 } from '../modelsJson/Chapter';
import { Note2 } from '../modelsJson/Note';
import { Paragraph } from '../modelsJson/Paragraph';
import { SecondaryNote } from '../modelsJson/SecondaryNote';
import { Verse } from '../modelsJson/Verse';
import { StringService } from './string.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public editState = false;
  chapter2: Chapter2 = new Chapter2();
  constructor(private stringService: StringService) {}

  public setEditMode(
    editState: boolean,
    note: Note2,
    secondaryNote: SecondaryNote,
  ): void {
    this.editState = editState;

    if (this.editState) {
      this.enableEditMode(note, secondaryNote);
    } else {
      console.log(this.editState);

      this.disableEditMode();
    }
  }
  private disableEditMode(): void {
    this.editState = false;
    this.chapter2.notes.forEach((chapterNote: Note2) => {
      chapterNote.sn.forEach((sn: SecondaryNote) => {
        sn.disabled = false;
      });
    });
    this.chapter2.paragraphs.forEach((paragraph: Paragraph) => {
      paragraph.verses.forEach((verse: Verse) => {
        verse.disabled = false;
        // verse.classList = this.stringService.removeAttribute(
        //   verse.classList,
        //   'verse-disable',
        // );

        verse.wTags2.forEach(
          (
            w: [
              string,
              string,
              string,
              string,
              string,
              string,
              number,
              string[],
              string[],
              boolean,
              boolean
            ],
          ) => {
            w[10] = false;
          },
        );
      });
    });
  }

  private enableEditMode(note: Note2, secondaryNote: SecondaryNote) {
    this.chapter2.notes.forEach((chapterNote: Note2) => {
      chapterNote.sn.forEach((sn: SecondaryNote) => {
        if (sn !== secondaryNote) {
          sn.disabled = true;
        }
      });
    });
    this.chapter2.paragraphs.forEach((paragraph: Paragraph) => {
      paragraph.verses.forEach((verse: Verse) => {
        if (verse.id !== `p${note.id.replace('note', '')}`) {
          // verse.classList = this.stringService.addAttribute(
          //   verse.classList,
          //   'verse-disable',
          // );
          // console.log(verse.classList);

          verse.disabled = true;
        } else {
          verse.classList = '';
          // verseSelected = verse;
          verse.disabled = false;
        }
      });
    });
  }
}
