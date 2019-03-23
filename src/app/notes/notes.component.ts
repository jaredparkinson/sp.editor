import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {} from 'lodash';
import { Note } from '../modelsJson/Note';
import { SecondaryNote } from '../modelsJson/SecondaryNote';
import { W } from '../modelsJson/WTag';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { EditService } from '../services/EditService';
import { MediaQueryService } from '../services/media-query.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { StringService } from '../services/string.service';
import { SyncScrollingService } from '../services/sync-scrolling.service';
// import { VerseSelectService } from '../services/verse-select.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit, AfterViewInit {
  constructor(
    public chapterService: ChapterService,
    public navServices: NavigationService,
    public saveState: SaveStateService,
    private stringService: StringService,
    public sanitizer: DomSanitizer,
    public editService: EditService,
    public mediaQueryService: MediaQueryService,
    public syncScrollingService: SyncScrollingService,
    // public verseSelectService: VerseSelectService,
    public dataService: DataService,
  ) {}
  @ViewChildren('notes')
  notes!: QueryList<ElementRef>;

  async ngAfterViewInit() {
    // await setTimeout(() => {
    //   this.notes.changes.subscribe(() => {
    //     this.verseSelectService.notes = this.notes.toArray();
    //   });
    // }, 0);
  }

  filterClassList(classList: string[]): string {
    if (!classList) {
      return '';
    }

    return classList.toString();
  }
  ngOnInit() {}

  notesOnBottom(): boolean {
    console.log(
      window.matchMedia(
        `screen and (max-width: 499.98px), (orientation: portrait) and (max-width: 1023.98px)`,
      ),
    );
    console.log('asdfasdfasdfasdfwer23412341234');
    return window.matchMedia(
      `screen and (max-width: 499.98px), (orientation: portrait) and (max-width: 1023.98px)`,
    ).matches;
  }

  notePhraseClick(secondaryNote: SecondaryNote) {
    console.log(secondaryNote.id);
    const clicked = secondaryNote.clicked;
    console.log(clicked);

    this.chapterService.resetNotes().then(() => {
      secondaryNote.clicked = clicked;
      if (clicked) {
        secondaryNote.clicked = false;
      } else {
        secondaryNote.clicked = true;
        this.dataService.verses.forEach(verse => {
          verse.wTags.forEach(wTag => {
            wTag.selected = wTag.refs && wTag.refs.includes(secondaryNote.id);
            // if (wTag.refs && wTag.refs.includes(secondaryNote.id)) {
            //   wTag.selected = true;
            // } else {
            //   wTag.selected = false;
            // }
          });
        });
      }
    });
  }

  trackById(note: Note) {
    return note.id;
  }
  // showNote(secondaryNote: SecondaryNote): boolean {
  //   // return this.verseSelectService.noteVisibility.get(secondaryNote.id);
  // }
  // showSecondaryNote(
  //   note: Note,
  //   seNote: [string, string, string, string],
  // ): boolean {
  //   let vis = true;

  //   if (
  //     seNote[1].includes('-2') &&
  //     !this.saveState.data.secondaryNotesVisible
  //   ) {
  //     return false;
  //   }
  //   if (seNote[2].includes('reference-label')) {
  //     if (
  //       (seNote[2].includes('reference-label-quotation') &&
  //         !this.saveState.data.refQUO) ||
  //       (seNote[2].includes('reference-label-phrasing') &&
  //         !this.saveState.data.refPHR) ||
  //       (seNote[2].includes('reference-label-or') &&
  //         !this.saveState.data.refOR) ||
  //       (seNote[2].includes('reference-label-ie') &&
  //         !this.saveState.data.refIE) ||
  //       (seNote[2].includes('reference-label-hebrew') &&
  //         !this.saveState.data.refHEB) ||
  //       (seNote[2].includes('reference-label-greek') &&
  //         !this.saveState.data.refGR) ||
  //       (seNote[2].includes('reference-label-archaic') &&
  //         !this.saveState.data.refKJV) ||
  //       (seNote[2].includes('reference-label-historical') &&
  //         !this.saveState.data.refHST) ||
  //       (seNote[2].includes('reference-label-cr') &&
  //         !this.saveState.data.refCR) ||
  //       (seNote[2].includes('reference-label-alt') &&
  //         !this.saveState.data.refALT) ||
  //       (seNote[2].includes('reference-label-harmony') &&
  //         !this.saveState.data.refHMY) ||
  //       (seNote[2].includes('reference-label-tg') &&
  //         !this.saveState.data.refTG) ||
  //       (seNote[2].includes('reference-label-gs') && !this.saveState.data.refGS)
  //     ) {
  //       // console.log('gtcrd');
  //       return false;
  //     }
  //   }
  //   seNote[1].split(' ').forEach(c => {
  //     switch (c) {
  //       case 'note-phrase-eng-2': {
  //         if (this.getNoteVisibility(note)) {
  //           vis = false;
  //         }
  //         break;
  //       }
  //       case 'note-reference-eng-2': {
  //         if (this.getNoteVisibility(note)) {
  //           vis = false;
  //         }
  //         break;
  //       }
  //       case 'note-phrase-tc-2': {
  //         if (this.getNoteVisibility(note)) {
  //           vis = false;
  //         }
  //         break;
  //       }
  //       case 'note-reference-tc-2': {
  //         if (this.getNoteVisibility(note)) {
  //           vis = false;
  //         }
  //         break;
  //       }
  //       case 'note-phrase-new-2': {
  //         if (this.getNoteVisibility(note)) {
  //           vis = false;
  //         }
  //         break;
  //       }
  //       case 'note-reference-new-2': {
  //         if (this.getNoteVisibility(note)) {
  //           vis = false;
  //         }
  //         break;
  //       }
  //       default: {
  //         vis = vis;
  //       }
  //     }
  //   });
  //   // vis = false;
  //   return vis;
  // }
}
