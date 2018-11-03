import { HttpClient } from '@angular/common/http';
import { Element } from '@angular/compiler';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  faBars,
  faBookOpen,
  faGlobe,
  faListUl,
  faParagraph,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { timeout } from 'q';
import { Note } from '../models/Note';
import { Note2 } from '../modelsJson/Note';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { VerseSelectService } from '../services/verse-select.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, AfterViewInit {
  constructor(
    public chapterService: ChapterService,
    public navServices: NavigationService,
    private sanitizer: DomSanitizer,
    public saveState: SaveStateService,
    private router: Router,
    private verseSelectService: VerseSelectService
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
    // console.log(this.noteh.toArray().length);

    // while (this.noteh.toArray().length === 0) {}
    await setTimeout(() => {
      this.notes.changes.subscribe(() => {
        this.verseSelectService.notes = this.notes.toArray();

        // console.log('notes ' + this.notes);
      });
      // console.log(this.wtags.toArray());
      // this.verseSelectService.test();
    }, 100);
  }
  ngOnInit() {}

  noteButtonClick(note: Note2) {
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
  }

  trackById(index: number, note: Note) {
    return note.id;
  }
}
