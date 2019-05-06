import { Injectable } from '@angular/core';
import { NoteType, SecondaryNote } from 'oith.models/dist';
import { SaveStateService } from './save-state.service';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  public constructor(private saveStateService: SaveStateService) {}
  public async secondaryNotesVisibility(
    secondaryNotes: SecondaryNote[],
  ): Promise<void> {
    secondaryNotes.forEach(
      (secondaryNote): void => {
        this.secondaryNoteVisibility(secondaryNote);
      },
    );
  }

  public async secondaryNoteVisibility(
    secondaryNote: SecondaryNote,
  ): Promise<void> {
    secondaryNote.visible = false;
    secondaryNote.noteRefs.forEach(
      (noteRef): void => {
        noteRef.visible = this.convertNoteTypeToSaveState(noteRef.type);
        if (secondaryNote.notePhrase && noteRef.visible === true) {
          secondaryNote.notePhrase.visible = true;
          secondaryNote.visible = true;
        }
      },
    );
  }

  private convertNoteTypeToSaveState(type: NoteType | undefined): boolean {
    switch (type) {
      case 2:
        return this.saveStateService.data.engNotesVisible;
      case 1:
        return this.saveStateService.data.newNotesVisible;
      case 3:
        return this.saveStateService.data.translatorNotesVisible;
      default:
        return true;
    }
  }
}
