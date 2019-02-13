import { ElementRef, Injectable } from '@angular/core';
import * as lodash from 'lodash';
import { Note } from '../modelsJson/Note';
import { Paragraph } from '../modelsJson/Paragraph';
import { NoteRef, SecondaryNote } from '../modelsJson/SecondaryNote';
import { Verse } from '../modelsJson/Verse';
import { W } from '../modelsJson/WTag';
import { ChapterService } from './chapter.service';
import { EditService } from "./EditService";
import { HelperService } from './helper.service';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';
import { StringService } from './string.service';

@Injectable({
  providedIn: 'root',
})
export class VerseSelectService {
  public halfNotes = false;
  public notes: ElementRef[] = [];
  constructor(
    private saveState: SaveStateService,
    private helperService: HelperService,
    private navService: NavigationService,
    private editService: EditService,
    private stringService: StringService,
  ) {}
  public noteVisibility: Map<string, boolean> = new Map<string, boolean>();

  public async resetVisibility() {
    await this.resetNoteVisibility().then(() => {
      return new Promise<void>(
        (
          resolve: (resolveValue: void) => void,
          reject: (rejectValue: void) => void,
        ) => {
          this.resetVerseSelect().then(() => {
            resolve(undefined);
          });
        },
      );
    });
  }
  private async resetNoteVisibility(): Promise<void> {
    return new Promise<void>(
      (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        this.editService.chapter2.notes.forEach((note: Note) => {
          this.setNoteVisibility(note);
        });
        resolve(null);
      },
    );
  }

  public setNoteVisibility(note: Note) {
    note.secondaryNotes.forEach((secondaryNote: SecondaryNote) => {
      let vis = false;
      secondaryNote.noteRefs.forEach(seNote => {
        if (this.showSecondaryNote(note, seNote)) {
          vis = true;
        }
      });
      secondaryNote.cn.split(' ').forEach(c => {
        switch (c) {
          case 'tc-note': {
            if (!this.saveState.data.translatorNotesVisible) {
              vis = false;
            }
            break;
          }
          case 'new-note': {
            if (!this.saveState.data.newNotesVisible) {
              vis = false;
            }
            break;
          }
          case 'eng-note': {
            if (!this.saveState.data.englishNotesVisible) {
              vis = false;
            }
            break;
          }
          default: {
            vis = vis;
          }
        }
      });

      this.noteVisibility.set(secondaryNote.id, vis);
    });
  }

  private showSecondaryNote(note: Note, seNote: NoteRef): boolean {
    // const engRegex = new RegExp(`\d{9}`);
    // const newRegex = new RegExp(`\d{4}(\-\d{2}){6}`);
    // const tcRegex = new RegExp(`tc.*`);

    seNote.visible = true;

    if (
      seNote.classList.includes('reference-label') ||
      seNote.text.includes('reference-label')
    ) {
      if (
        ((seNote.classList.includes('reference-label-quotation') ||
          seNote.text.includes('reference-label-quotation')) &&
          !this.saveState.data.refQUO) ||
        ((seNote.classList.includes('reference-label-phrasing') ||
          seNote.text.includes('reference-label-phrasing')) &&
          !this.saveState.data.refPHR) ||
        ((seNote.classList.includes('reference-label-or') ||
          seNote.text.includes('reference-label-or')) &&
          !this.saveState.data.refOR) ||
        ((seNote.classList.includes('reference-label-ie') ||
          seNote.text.includes('reference-label-ie')) &&
          !this.saveState.data.refIE) ||
        ((seNote.classList.includes('reference-label-hebrew') ||
          seNote.text.includes('reference-label-hebrew')) &&
          !this.saveState.data.refHEB) ||
        ((seNote.classList.includes('reference-label-greek') ||
          seNote.text.includes('reference-label-greek')) &&
          !this.saveState.data.refGR) ||
        ((seNote.classList.includes('reference-label-archaic') ||
          seNote.text.includes('reference-label-archaic')) &&
          !this.saveState.data.refKJV) ||
        ((seNote.classList.includes('reference-label-historical') ||
          seNote.text.includes('reference-label-historical')) &&
          !this.saveState.data.refHST) ||
        ((seNote.classList.includes('reference-label-cr') ||
          seNote.text.includes('reference-label-cr')) &&
          !this.saveState.data.refCR) ||
        ((seNote.classList.includes('reference-label-alt') ||
          seNote.text.includes('reference-label-alt')) &&
          !this.saveState.data.refALT) ||
        ((seNote.classList.includes('reference-label-harmony') ||
          seNote.text.includes('reference-label-harmony')) &&
          !this.saveState.data.refHMY) ||
        ((seNote.classList.includes('reference-label-tg') ||
          seNote.text.includes('reference-label-tg')) &&
          !this.saveState.data.refTG) ||
        ((seNote.classList.includes('reference-label-gs') ||
          seNote.text.includes('reference-label-gs')) &&
          !this.saveState.data.refGS)
      ) {
        seNote.visible = false;

        // return false;
      }
    }
    seNote.classList.forEach(c => {
      if (c.includes('-t2')) {
        if (!this.getNoteVisibility(note)) {
          seNote.visible = false;
        }
      }
    });

    console.log(seNote.visible);
    

    return seNote.visible;
  }
  private getNoteVisibility(note: Note) {
    return !this.saveState.data.secondaryNotesVisible;
  }

  public toggleVerseSelect(toggle: boolean = !this.saveState.data.verseSelect) {
    this.saveState.data.verseSelect = toggle;

    this.saveState.save();
    this.resetVerseSelect();
  }
  public toggleVerseSuperScripts(
    toggle: boolean = !this.saveState.data.verseSuperScripts,
  ) {
    this.saveState.data.verseSuperScripts = toggle;

    this.saveState.save();
    this.resetVerseSelect();
  }

  public resetVerseNotes(wTag: W = null) {
    this.resetNotes2();
    this.resetVerseSelect(wTag);
  }

  public resetVerseSelect(wTag: W = null): Promise<void> {
    return new Promise<void>(
      (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        this.modifyWTags((wa: W) => {
          if (wa !== wTag) {
            wa.visibleRefs = [];

            wa.classList = this.stringService.removeAttributeArray(
              wa.classList,
              'verse-select-0',
            );
            wa.classList = this.stringService.removeAttributeArray(
              wa.classList,
              'note-select-1',
            );
            wa.classList = this.stringService.removeAttributeArray(
              wa.classList,
              'verse-select-1',
            );

            if (true) {
              this.createRefList(wa);

              if (wa.visibleRefs.length !== 0) {
                wa.classList = this.stringService.addAttributeArray(
                  wa.classList,
                  'verse-select-0',
                );
                wa.classList = this.stringService.removeAttributeArray(
                  wa.classList,
                  'verse-select-1',
                );

                wa.classList = this.stringService.removeAttributeArray(
                  wa.classList,
                  'verse-select-2',
                );
              }
            }
          }
        });
        resolve(null);
      },
    );
  }

  private createRefList(wa: W) {
    wa.wRef = false;
    wa.refs.forEach(w => {
      if (w.trim() !== '' && this.noteVisibility.get(w)) {
        wa.visibleRefs.push(w);
      }
    });
    if (wa.visibleRefs.length > 1) {
      wa.wRef = true;
    }
  }

  public modifyWTags(callBack: (wa: W) => void) {
    this.editService.chapter2.paragraphs.forEach((paragraph: Paragraph) => {
      paragraph.verses.forEach((verse: Verse) => {
        verse.wTags.forEach((w: W) => {
          callBack(w);
        });
      });
    });
  }

  public resetNotes2() {
    this.notes.forEach(n => {
      (n.nativeElement as HTMLElement).classList.remove('verse-select-1');
    });
  }

  public wTagClick(w: W, verse: Verse) {
    this.halfNotes = false;
    if (
      w.refs.length === 0 &&
      !this.stringService.hasAttributeArray(w.classList, 'verse-select-2') &&
      !this.stringService.hasAttributeArray(w.classList, 'verse-select-1')
    ) {
      return;
    }
    if (this.stringService.hasAttributeArray(w.classList, 'verse-select-0')) {
      this.firstClick(w, verse);
    } else if (
      this.stringService.hasAttributeArray(w.classList, 'verse-select-1')
    ) {
      this.resetVerseNotes();
      this.openHalfNotes(w, verse);
    } else if (
      this.stringService.hasAttributeArray(w.classList, 'verse-select-2')
    ) {
      this.selectNote(verse, w);
    }
  }
  private firstClick(w: W, verse: Verse) {
    this.resetVerseSelect().then(() => {
      this.highlightRelatedWords(verse, w);
      this.selectNote(verse, w, false);
    });
  }

  private highlightRelatedWords(verse: Verse, w: W) {
    verse.wTags.forEach(wr => {
      w.visibleRefs.forEach((ref: string) => {
        if (wr.visibleRefs.includes(ref) && wr.visibleRefs.length >= 1) {
          wr.classList = this.stringService.removeAttributeArray(
            wr.classList,
            'verse-select-0',
          );
          wr.classList =
            wr.visibleRefs.length > 1
              ? this.stringService.addAttributeArray(
                  wr.classList,
                  'verse-select-2',
                )
              : this.stringService.addAttributeArray(
                  wr.classList,
                  'verse-select-1',
                );
        }
      });
    });
  }

  private selectNote(verse: Verse, wTag: W, resetVerse: boolean = true) {
    this.resetNotes2();
    if (wTag.refs.length === 0) {
      this.resetVerseNotes();
      this.openHalfNotes(wTag, verse);
      return;
    }
    const note = lodash.find(this.notes, (n: ElementRef) => {
      return (n.nativeElement as HTMLElement).id === wTag.visibleRefs[0];
    });

    if (note) {
      (note.nativeElement as HTMLElement).classList.add('verse-select-1');
      (note.nativeElement as HTMLElement).scrollIntoView({
        block: 'start',
      });

      document.querySelector('footer').scrollBy(0, -10);

      if (resetVerse) {
        this.resetVerseSelect(wTag);
        this.highlightRelatedWords(verse, wTag);
      }

      wTag.visibleRefs.shift();
      this.openHalfNotes(wTag, verse);
      this.navService.rightPaneToggle = true;
    } else {
      this.resetVerseNotes();
      this.openHalfNotes(wTag, verse);
    }
  }

  private openHalfNotes(w: W, verse: Verse) {
    if (this.helperService.getWidth() < 511.98) {
      document.getElementById(verse.id).scrollIntoView();
      this.halfNotes = true;
    }
  }
}
