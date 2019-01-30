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
import { Note } from '../modelsJson/Note';
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
  ngOnInit() {}
  setNotePhraseText(
    secondaryNote: SecondaryNote,
    sn: [string, string, string, string],
  ) {
    this.setUnderlining(secondaryNote);
    console.log(secondaryNote.id);

    if (secondaryNote.id === '2018-09-15-15-14-47-28') {
      secondaryNote.seNote[0][2] = '«&nbsp;ravi en vision&nbsp;»';
      secondaryNote.seNote[1][2] = `<span class=\"reference-label-phrasing\">&nbsp;</span><a class=\"scripture-ref\" href=\"#/1-kgs/18.11-12\">1&nbsp;R 18:11–12</a>; <a class=\"scripture-ref\" href=\"#/ezek/37.1\">Éz 37:1</a>; <a class=\"scripture-ref\" href=\"#/rev/17.3\">Ap 17:3</a>; <a class=\"scripture-ref\" href=\"#/rev/21.10\">21:10</a>; <a class=\"scripture-ref\" href=\"#/1-ne/11.19,29\">1&nbsp;Né 11:19, 29</a>; <a class=\"scripture-ref\" href=\"#/1-ne/14.30\">14:30</a>; <a class=\"scripture-ref\" href=\"#/1-ne/15.1\">15:1</a>; <a class=\"scripture-ref\" href=\"#/2-ne/4.25\">2&nbsp;Né 4:25</a>; <a class=\"scripture-ref\" href=\"#/alma/19.6\">Al 19:6</a>; <a class=\"scripture-ref\" href=\"#/alma/29.16\">29:16</a>; <a class=\"scripture-ref\" href=\"#/moses/6.64\">Moï 6:64</a>; see <a class=\"scripture-ref\" href=\"#/matt/4.1\">Mt 4:1</a>; TJS <a class=\"scripture-ref\" href=\"#/matt/4.5,8\">Mt 4:5, 8</a> (see Matthew verse notes); TJS <a class=\"scripture-ref\" href=\"#/luke/4.5,9\">Lu 4:5, 9</a> (see Luke verse notes); <a class=\"scripture-ref\" href=\"#/luke/4.29-30\">Lu 4:29–30</a>; <a class=\"scripture-ref\" href=\"#/hel/10.16-17\">Hél 10:16–17</a>`;
    } else if (secondaryNote.id === '2018-09-15-15-14-47-82') {
      secondaryNote.seNote[0][2] = '«&nbsp;de voir les cieux s’ouvrir&nbsp;»';
      secondaryNote.seNote[1][2] = `<span class=\"reference-label-phrasing\">&nbsp;</span><a class=\"scripture-ref\" href=\"#/ezek/1.1\">Éz 1:1</a>; <a class=\"scripture-ref\" href=\"#/matt/3.16\">Mt 3:16</a>; <a class=\"scripture-ref\" href=\"#/john/1.51\">Jn 1:51</a>; <a class=\"scripture-ref\" href=\"#/acts/7.55-56\">Ac 7:55–56</a>; <a class=\"scripture-ref\" href=\"#/1-ne/11.14,27,30\">1&nbsp;Né 11:14, 27, 30</a>; <a class=\"scripture-ref\" href=\"#/moses/7.3\">Moï 7:3</a>; <a class=\"scripture-ref\" href=\"#/js-h/1.43\">JS, H 1:43</a>; see also <a class=\"scripture-ref\" href=\"#/mal/3.10\">Mal 3:10</a>`;
    } else if (secondaryNote.id === '2018-09-15-15-14-48-38') {
      secondaryNote.seNote[0][2] =
        '«&nbsp;concours innombrable d’anges … louer leur Dieu&nbsp;»';
      secondaryNote.seNote[1][2] = `<span class=\"reference-label-phrasing\">&nbsp;</span><a class=\"scripture-ref\" href=\"#/alma/36.22\">Al 36:22</a>`;
    } else {
      console.log(sn);

      const wTags = document.querySelectorAll('w.select');

      if (wTags) {
        let notePhrase = '« ';
        sn[2] = '';
        wTags.forEach((elem: Element) => {
          if (elem.textContent === 'louer') {
            notePhrase = `${notePhrase} ... ${elem.textContent}`;
          } else {
            notePhrase = `${notePhrase}${elem.textContent}`;
          }
        });

        if (notePhrase[0] === ',') {
          notePhrase = notePhrase.substring(1, notePhrase.length);
        }
        sn[2] = `${notePhrase.trim()} »`;
      }
    }

    this.dataService.setEditMode(false, null, null);
    this.verseSelectService.resetVerseSelect();
  }
  setUnderlining(secondaryNote: SecondaryNote): void {
    const wTags = document.querySelectorAll('w.select');

    console.log(wTags);

    if (wTags) {
      const verseId = wTags[0].parentElement.id;
      console.log(verseId);
      if (verseId) {
        wTags.forEach((elem: Element) => {
          const wTagId = elem.firstElementChild.className;

          this.dataService.chapter2.paragraphs.forEach(
            (paragraph: Paragraph) => {
              paragraph.verses.forEach((verse: Verse) => {
                if (verse.id === verseId.toString()) {
                  verse.wTags2.forEach(wTag => {
                    if (wTag[2] == wTagId) {
                      wTag[3] = `${wTag[3]},${secondaryNote.id}`;
                    }
                  });
                }
              });
            },
          );
        });
      }
    }
  }

  editNoteClick(note: Note, secondaryNote: SecondaryNote, event: Event): void {
    console.log(event);

    if (
      !this.dataService.editState &&
      (event.target as HTMLElement).localName !== 'button'
    ) {
      console.log('asdjfasdf');

      this.chapterService.selectedSecondaryNote = secondaryNote;
      // let verseSelected: Verse;

      this.dataService.setEditMode(true, note, secondaryNote);
    }

    // this.dataService.chapter2.notes.forEach((chapterNote: Note2) => {
    //   chapterNote.sn.forEach((sn: SecondaryNote) => {
    //     if (sn !== secondaryNote) {
    //       sn.disabled = true;
    //     }
    //   });
    //  });
    // this.dataService.chapter2.paragraphs.forEach((paragraph: Paragraph) => {

    //   paragraph.verses.forEach((verse: Verse) => {
    //     if (verse.id !== `p${note.id.replace('note', '')}`) {
    //       verse.classList = 'verse-disable';
    //       verse.disabled = true;

    //     } else {
    //       verse.classList = '';
    //       verseSelected = verse;
    //       verse.disabled = false;
    //     }
    //   });

    // });
    // console.log(verseSelected);
  }
  disableEditMode(): void {
    this.dataService.setEditMode(false, null, null);
  }
  notePhraseClick(secondaryNote: SecondaryNote) {
    if (false) {
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

      this.verseSelectService.modifyWTags((w: W) => {
        w.classList = this.stringService.removeAttributeArray(
          w.classList,
          'note-select-1',
        );

        if (w.classList.includes(secondaryNote.id)) {
          w.classList = this.stringService.addAttributeArray(
            w.classList,
            'note-select-1',
          );
          count++;
        }
      });

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

  noteButtonClick(note: Note) {
    console.log(note);

    switch (note.override) {
      case true: {
        note.visible = !note.visible;
        break;
      }

      default: {
        note.override = true;

        note.visible = !this.saveState.data.secondaryNotesVisible;
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
    note: Note,
    seNote: [string, string, string, string],
  ): boolean {
    let vis = true;

    if (seNote[1].includes('-2') && note.override && !note.visible) {
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

  private getNoteVisibility(note: Note) {
    return (
      !this.saveState.data.secondaryNotesVisible ||
      (note.override && !note.visible)
    );
  }
}
