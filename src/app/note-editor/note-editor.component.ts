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
import { Note } from '../modelsJson/Note';
import { SecondaryNote } from '../modelsJson/SecondaryNote';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { EditService } from '../services/EditService';
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
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
}
