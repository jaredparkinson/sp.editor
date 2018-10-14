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
  noteh!: QueryList<ElementRef>;
  @ViewChildren('w')
  wtags!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    // console.log(this.noteh.toArray().length);

    // while (this.noteh.toArray().length === 0) {}
    setTimeout(() => {
      this.verseSelectService.noteh = this.noteh;
      // console.log(this.wtags.toArray());
      // this.verseSelectService.test();
    }, 1000);
  }
  getNotes(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.chapterService.notes);
  }
  ngOnInit() {}

  noteButtonClick(note: Note2) {
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
  }

  trackById(index: number, note: Note) {
    return note.id;
  }
}
