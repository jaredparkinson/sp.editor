import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { ChapterService } from '../services/chapter.service';
import { SaveStateService } from '../services/save-state.service';

import {
  faBars,
  faBookOpen,
  faListUl,
  faParagraph,
  faPlus,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  faBars = faBars;
  faParagraph = faParagraph;
  faBookOpen = faBookOpen;
  faPlus = faPlus;
  faListUl = faListUl;
  faGlobe = faGlobe;
  constructor(
    public chapterService: ChapterService,
    public navServices: NavigationService,
    public saveState: SaveStateService
  ) {}

  getNotes(): string {
    return this.chapterService.notes;
  }
  ngOnInit() {}
}
