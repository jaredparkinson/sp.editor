import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { ChapterService } from '../services/chapter.service';
import { SaveStateService } from '../services/save-state.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  constructor(
    public chapterService: ChapterService,
    public navService: NavigationService,
    public saveState: SaveStateService
  ) {}

  getNotes(): string {
    return this.chapterService.notes;
  }
  ngOnInit() {}
}
