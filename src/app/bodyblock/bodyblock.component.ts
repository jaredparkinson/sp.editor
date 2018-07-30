import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { ChapterService } from '../services/chapter.service';
import { SaveStateService } from '../services/save-state.service';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss']
})
export class BodyblockComponent implements OnInit {
  constructor(
    public fileManager: NavigationService,
    public httpClient: HttpClient,
    // public activatedRoute: ActivatedRoute,
    public chapterService: ChapterService,
    public navService: NavigationService,
    public saveState: SaveStateService
  ) {}

  getBodyBlock(): string {
    return this.chapterService.bodyBlock;
  }
  ngOnInit() {}
}
