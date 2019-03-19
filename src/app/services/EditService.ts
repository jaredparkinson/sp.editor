import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class EditService {
  public editState = false;
  constructor() {}
  public setEditMode(editState: boolean): void {
    this.editState = editState;
    if (this.editState) {
      this.enableEditMode();
    } else {
      console.log(this.editState);
      this.disableEditMode();
    }
  }
  private disableEditMode(): void {
    // this.editState = false;
    // this.chapter2.notes.forEach((chapterNote: Note) => {
    //   chapterNote.secondaryNotes.forEach((sn: SecondaryNote) => {
    //     sn.disabled = false;
    //   });
    // });
    // this.chapter2.paragraphs.forEach((paragraph: Paragraph) => {
    //   paragraph.verses.forEach((verse: Verse) => {
    //     verse.disabled = false;
    //     // verse.classList = this.stringService.removeAttribute(
    //     //   verse.classList,
    //     //   'verse-disable',
    //     // );
    //     verse.classList = this.stringService.removeAttributeArray(
    //       verse.classList,
    //       'verse-disable',
    //     );
    //     verse.wTags.forEach((w: W) => {
    //       w.selected = false;
    //     });
    //   });
    // });
  }
  private enableEditMode() {
    // this.chapter2.notes.forEach((chapterNote: Note) => {
    //   chapterNote.secondaryNotes.forEach((sn: SecondaryNote) => {
    //     if (sn !== secondaryNote) {
    //       sn.disabled = true;
    //     }
    //   });
    // });
    // this.chapter2.paragraphs.forEach((paragraph: Paragraph) => {
    //   paragraph.verses.forEach((verse: Verse) => {
    //     if (verse.id !== `p${note.id.replace('note', '')}`) {
    //       // verse.classList = this.stringService.addAttribute(
    //       //   verse.classList,
    //       //   'verse-disable',
    //       // );
    //       // console.log(verse.classList);
    //       verse.disabled = true;
    //     } else {
    //       verse.classList = [];
    //       // verseSelected = verse;
    //       verse.disabled = false;
    //     }
    //   });
    // });
  }
}
