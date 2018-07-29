import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { ChapterService } from '../shared/chapter.service';
import { SaveStateService } from '../shared/save-state.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  constructor(
    private chapterService: ChapterService,
    private navService: NavigationService,
    private saveState: SaveStateService
  ) {}

  getNotes(): string {
    return this.chapterService.notes;
  }
  ngOnInit() {}
}
