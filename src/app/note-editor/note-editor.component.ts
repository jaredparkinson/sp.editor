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
import {
  faBars,
  faBookOpen,
  faGlobe,
  faListUl,
  faParagraph,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';
import { Note } from '../models/Note';
import { Note2 } from '../modelsJson/Note';
import { Paragraph } from '../modelsJson/Paragraph';
import { SecondaryNote } from '../modelsJson/SecondaryNote';
import { Verse } from '../modelsJson/Verse';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { StringService } from '../services/string.service';
import { VerseSelectService } from '../services/verse-select.service';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit, AfterViewInit {
  constructor(
    public chapterService: ChapterService,
    public navServices: NavigationService,
    public saveState: SaveStateService,
    private stringService: StringService,
    public sanitizer: DomSanitizer,
    public dataService: DataService,
    public verseSelectService: VerseSelectService,
  ) {}
  faBars = faBars;
  faParagraph = faParagraph;
  faBookOpen = faBookOpen;
  faPlus = faPlus;
  faListUl = faListUl;
  faGlobe = faGlobe;
  @ViewChildren('notes')
  notes!: QueryList<ElementRef>;

  async ngAfterViewInit() {
    await setTimeout(() => {
      this.notes.changes.subscribe(() => {
        this.verseSelectService.notes = this.notes.toArray();
      });
    }, 0);
  }
  ngOnInit() { }

  editNoteClick(note: Note2, secondaryNote: SecondaryNote): void {
    this.chapterService.wTagSelectMode = true;
    let verseSelected: Verse;
    this.dataService.chapter2.paragraphs.forEach((paragraph: Paragraph) => {

      paragraph.verses.forEach((verse: Verse) => {
        if (verse.id !== `p${note.id.replace('note', '')}`) {
          verse.classList = 'verse-disable';
          verse.disabled = true;

        } else {
          verse.classList = '';
          verseSelected = verse;
          verse.disabled = false;
        }
      });

    });
    console.log(verseSelected);

  }
  notePhraseClick(secondaryNote: SecondaryNote) {
    if (true) {
      let count = 0;

      // console.log(secondaryNote.id);

      const note = lodash.find(this.notes.toArray(), (n: ElementRef) => {
        return (n.nativeElement as Element).id === secondaryNote.id;
      });
      // console.log(note);

      if (
        note &&
        (note.nativeElement as Element).classList.contains('verse-select-1')
      ) {
        // this.chapterService.resetVerseSelect();
        this.verseSelectService.resetVerseNotes();

        return;
      }
      this.verseSelectService.resetVerseNotes();

      this.verseSelectService.modifyWTags(
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
          w[0] = this.stringService.removeAttribute(w[0], 'note-select-1');
          if (lodash.includes(w[7], secondaryNote.id)) {
            // console.log(w);

            console.log(w[7]);

            w[0] = this.stringService.addAttribute(w[0], 'note-select-1');
            count++;
          }
        },
      );

      if (count > 0) {
        console.log();

        const verseId = (note.nativeElement as Element).parentElement.id.replace(
          'note',
          'p',
        );
        document.getElementById(verseId).scrollIntoView();
        if (note) {
          (note.nativeElement as Element).classList.add('verse-select-1');
        }
      }
      // console.log(secondaryNote.cn);
    }
  }

  noteButtonClick(note: Note2) {
    console.log(note);

    switch (note.o) {
      case true: {
        note.v = !note.v;
        break;
      }

      default: {
        note.o = true;

        note.v = !this.saveState.data.secondaryNotesVisible;
        break;
      }
    }

    this.verseSelectService.setNoteVisibility(note);
  }

  trackById(note: Note) {
    return note.id;
  }
  showNote(secondaryNote: SecondaryNote): boolean {
    return this.verseSelectService.noteVisibility.get(secondaryNote.id);
    let vis = true;
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

    this.verseSelectService.noteVisibility.set(secondaryNote.id, vis);

    // console.log(this.verseSelectService.noteVisibility);

    return vis;
  }
  showSecondaryNote(
    note: Note2,
    seNote: [string, string, string, string],
  ): boolean {
    let vis = true;

    if (seNote[1].includes('-2') && note.o && !note.v) {
      return false;
    }
    if (seNote[2].includes('reference-label')) {
      if (
        (seNote[2].includes('reference-label-quotation') &&
          !this.saveState.data.refQUO) ||
        (seNote[2].includes('reference-label-phrasing') &&
          !this.saveState.data.refPHR) ||
        (seNote[2].includes('reference-label-or') &&
          !this.saveState.data.refOR) ||
        (seNote[2].includes('reference-label-ie') &&
          !this.saveState.data.refIE) ||
        (seNote[2].includes('reference-label-hebrew') &&
          !this.saveState.data.refHEB) ||
        (seNote[2].includes('reference-label-greek') &&
          !this.saveState.data.refGR) ||
        (seNote[2].includes('reference-label-archaic') &&
          !this.saveState.data.refKJV) ||
        (seNote[2].includes('reference-label-historical') &&
          !this.saveState.data.refHST) ||
        (seNote[2].includes('reference-label-cr') &&
          !this.saveState.data.refCR) ||
        (seNote[2].includes('reference-label-alt') &&
          !this.saveState.data.refALT) ||
        (seNote[2].includes('reference-label-harmony') &&
          !this.saveState.data.refHMY) ||
        (seNote[2].includes('reference-label-tg') &&
          !this.saveState.data.refTG) ||
        (seNote[2].includes('reference-label-gs') && !this.saveState.data.refGS)
      ) {
        // console.log('gtcrd');
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
    return !this.saveState.data.secondaryNotesVisible || (note.o && !note.v);
  }
}
