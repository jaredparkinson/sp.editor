import { Component, OnInit } from '@angular/core';
import * as localForage from 'localforage';
import * as lodash from 'lodash';
import { Chapter2 } from '../modelsJson/Chapter';
import { ChapterService } from '../services/chapter.service';
import { DownloadService } from '../services/download.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(
    public downloadService: DownloadService,
    public saveState: SaveStateService,
    public navServices: NavigationService,
    public chapterService: ChapterService
  ) {}

  ngOnInit() {
    this.chapterService.chapter2 = new Chapter2();
    this.navServices.notesSettings = false;
  }

  download() {
    // this.downloadService.download(file);
  }
  reset() {
    localForage.clear();
  }
}
