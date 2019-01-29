import { ElementRef, Injectable } from '@angular/core';
import * as lodash from 'lodash';
import { Note2 } from '../modelsJson/Note';
import { SecondaryNote } from '../modelsJson/SecondaryNote';
import { Verse } from '../modelsJson/Verse';
import { ChapterService } from './chapter.service';
import { DataService } from './data.service';
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
    private dataService: DataService,
    private stringService: StringService,
  ) {}
  public noteVisibility: Map<string, boolean> = new Map<string, boolean>();

  public async resetVisibility() {
    await this.resetNoteVisibility().then(() => {
      // console.log(this.noteVisibility);
      return new Promise<void>(
        (
          resolve: (resolveValue: void) => void,
          reject: (rejectValue: void) => void,
        ) => {
          this.resetVerseSelect().then(() => {
            console.log('asdfiojaoijvnbviuoasdjf');

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
        this.dataService.chapter2.notes.forEach((note: Note2) => {
          this.setNoteVisibility(note);
        });
        resolve(null);
      },
    );
  }

  public setNoteVisibility(note: Note2) {
    note.secondaryNotes.forEach((secondaryNote: SecondaryNote) => {
      let vis = false;
      secondaryNote.seNote.forEach(seNote => {
        if (this.showSecondaryNote(note, seNote)) {
          vis = true;
          // console.log(`${secondaryNote.id}, ${seNote}`);
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
      // vis = false;
      // console.log(vis);

      this.noteVisibility.set(secondaryNote.id, vis);
    });
  }

  private showSecondaryNote(
    note: Note2,
    seNote: [string, string, string, string],
  ): boolean {
    let vis = true;

    if (seNote[1].includes('-2') && note.override && !note.visible) {
      return false;
    }
    if (
      seNote[1].includes('reference-label') ||
      seNote[2].includes('reference-label')
    ) {
      if (
        ((seNote[2].includes('reference-label-quotation') ||
          seNote[1].includes('reference-label-quotation')) &&
          !this.saveState.data.refQUO) ||
        ((seNote[2].includes('reference-label-phrasing') ||
          seNote[1].includes('reference-label-phrasing')) &&
          !this.saveState.data.refPHR) ||
        ((seNote[2].includes('reference-label-or') ||
          seNote[1].includes('reference-label-or')) &&
          !this.saveState.data.refOR) ||
        ((seNote[2].includes('reference-label-ie') ||
          seNote[1].includes('reference-label-ie')) &&
          !this.saveState.data.refIE) ||
        ((seNote[2].includes('reference-label-hebrew') ||
          seNote[1].includes('reference-label-hebrew')) &&
          !this.saveState.data.refHEB) ||
        ((seNote[2].includes('reference-label-greek') ||
          seNote[1].includes('reference-label-greek')) &&
          !this.saveState.data.refGR) ||
        ((seNote[2].includes('reference-label-archaic') ||
          seNote[1].includes('reference-label-archaic')) &&
          !this.saveState.data.refKJV) ||
        ((seNote[2].includes('reference-label-historical') ||
          seNote[1].includes('reference-label-historical')) &&
          !this.saveState.data.refHST) ||
        ((seNote[2].includes('reference-label-cr') ||
          seNote[1].includes('reference-label-cr')) &&
          !this.saveState.data.refCR) ||
        ((seNote[2].includes('reference-label-alt') ||
          seNote[1].includes('reference-label-alt')) &&
          !this.saveState.data.refALT) ||
        ((seNote[2].includes('reference-label-harmony') ||
          seNote[1].includes('reference-label-harmony')) &&
          !this.saveState.data.refHMY) ||
        ((seNote[2].includes('reference-label-tg') ||
          seNote[1].includes('reference-label-tg')) &&
          !this.saveState.data.refTG) ||
        ((seNote[2].includes('reference-label-gs') ||
          seNote[1].includes('reference-label-gs')) &&
          !this.saveState.data.refGS)
      ) {
        // console.log('gtcrd');
        // console.log(seNote[2].includes('reference-label-archaic'));

        return false;
      }
    }
    seNote[1].split(' ').forEach(c => {
      switch (c) {
        case 'note-phrase-eng-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-reference-eng-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-phrase-tc-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-reference-tc-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-phrase-new-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-reference-new-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        default: {
          vis = vis;
        }
      }
    });
    // vis = false;
    return vis;
  }
  private getNoteVisibility(note: Note2) {
    return (
      !this.saveState.data.secondaryNotesVisible ||
      (note.override && !note.visible)
    );
  }

  public toggleVerseSelect(toggle: boolean = !this.saveState.data.verseSelect) {
    this.saveState.data.verseSelect = toggle;
    // console.log(toggle);

    this.saveState.save();
    this.resetVerseSelect();
  }
  public toggleVerseSuperScripts(
    toggle: boolean = !this.saveState.data.verseSuperScripts,
  ) {
    this.saveState.data.verseSuperScripts = toggle;
    // console.log(this.saveState.data.verseSuperScripts);
    this.saveState.save();
    this.resetVerseSelect();
  }

  public resetVerseNotes(
    wTag: [
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
    ] = null,
  ) {
    this.resetNotes2();
    this.resetVerseSelect(wTag);
  }

  public resetVerseSelect(
    wTag: [
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
    ] = null,
  ): Promise<void> {
    return new Promise<void>(
      (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        this.modifyWTags(
          (
            wa: [
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
            if (wa !== wTag) {
              wa[7] = [];

              wa[0] = this.stringService.removeAttribute(
                wa[0],
                'verse-select-0',
              );
              wa[0] = this.stringService.removeAttribute(
                wa[0],
                'note-select-1',
              );
              wa[0] = this.stringService.removeAttribute(
                wa[0],
                'verse-select-1',
              );
              if (true) {
                this.createRefList(wa, this.saveState.data.newNotesVisible, 3);
                this.createRefList(
                  wa,
                  this.saveState.data.englishNotesVisible,
                  4,
                );
                this.createRefList(
                  wa,
                  this.saveState.data.translatorNotesVisible,
                  5,
                );

                if (wa[7].length !== 0) {
                  wa[0] = this.stringService.addAttribute(
                    wa[0],
                    'verse-select-0',
                  );
                  wa[0] = this.stringService.removeAttribute(
                    wa[0],
                    'verse-select-1',
                  );

                  wa[0] = this.stringService.removeAttribute(
                    wa[0],
                    'verse-select-2',
                  );
                }
              }
            }
          },
        );
        resolve();
      },
    );
  }

  private createRefList(
    wa: [
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
    vis: boolean,
    noteNumber: number,
  ) {
    (wa[noteNumber] as string).split(',').forEach(w => {
      if (w.trim() !== '' && this.noteVisibility.get(w)) {
        wa[7].push(w);
        // if (
        //   (w.includes('-t2') && this.saveState.data.secondaryNotesVisible) ||
        //   !w.includes('-t2')
        // ) {
        //   wa[7].push(w);
        // }
      }
    });
    wa[9] = wa[7].length > 1;
    if (vis) {
    }
  }

  public modifyWTags(
    callBack: (
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
    ) => void,
  ) {
    this.dataService.chapter2.paragraphs.forEach(paragrah => {
      paragrah.verses.forEach(verse => {
        verse.wTags2.forEach(wa => {
          callBack(wa);
        });
      });
    });
  }

  public resetNotes2() {
    this.notes.forEach(n => {
      (n.nativeElement as HTMLElement).classList.remove('verse-select-1');
    });
  }

  public wTagClick(
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
    verse: Verse,
  ) {
    // console.log(w[3].split(','));
    this.halfNotes = false;
    if (
      w[7].length === 0 &&
      !this.stringService.hasAttribute(w[0], 'verse-select-2') &&
      !this.stringService.hasAttribute(w[0], 'verse-select-1')
    ) {
      return;
    }
    if (this.stringService.hasAttribute(w[0], 'verse-select-0')) {
      this.firstClick(w, verse);
    } else if (this.stringService.hasAttribute(w[0], 'verse-select-1')) {
      this.resetVerseNotes();
      this.openHalfNotes(w, verse);
    } else if (this.stringService.hasAttribute(w[0], 'verse-select-2')) {
      this.selectNote(verse, w);
    }
    // if (this.saveState.data.verseSelect) {
    // }
  }
  private firstClick(
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
    verse: Verse,
  ) {
    this.resetVerseSelect();
    // console.log(w[7]);

    this.highlightRelatedWords(verse, w);
    this.selectNote(verse, w, false);
  }

  private highlightRelatedWords(
    verse: Verse,
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
  ) {
    verse.wTags2.forEach(wr => {
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
  }

  private selectNote(
    verse: Verse,
    wTag: [
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
    resetVerse: boolean = true,
  ) {
    this.resetNotes2();
    if (wTag[7].length === 0) {
      this.resetVerseNotes();
      this.openHalfNotes(wTag, verse);
      return;
    }
    const note = lodash.find(this.notes, (n: ElementRef) => {
      return (n.nativeElement as HTMLElement).id === wTag[7][0];
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

      wTag[7].shift();
      this.openHalfNotes(wTag, verse);
      this.navService.rightPaneToggle = true;
    } else {
      this.resetVerseNotes();
      this.openHalfNotes(wTag, verse);
    }
  }

  private openHalfNotes(
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
    verse: Verse,
  ) {
    if (this.helperService.getWidth() < 511.98) {
      // console.log(w);

      // console.log(
      //   document
      //     .querySelector('#' + verse.id + ' >:nth-child(' + w[2] + ')')
      //     .scrollIntoView()
      // );
      document.getElementById(verse.id).scrollIntoView();
      this.halfNotes = true;
    }
  }
}
