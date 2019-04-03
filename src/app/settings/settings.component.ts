import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
// import * as localForage from 'localforage';
import { find, first } from 'lodash';
import { Chapter2 } from '../modelsJson/Chapter';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { Database, DatabaseService } from '../services/database.service';
import { DownloadService } from '../services/download.service';
import { EditService } from '../services/EditService';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public currentDatabaseList: Database = new Database();

  public updating = false;
  private temp = undefined;

  constructor(
    public downloadService: DownloadService,
    public saveState: SaveStateService,
    public navServices: NavigationService,
    public chapterService: ChapterService,
    public swUpdate: SwUpdate,
    public editService: EditService,
    private dataService: DataService,
    private httpClient: HttpClient,
    private databaseService: DatabaseService,
  ) {}

  public checkForUpdates() {
    this.updating = true;
    this.swUpdate
      .checkForUpdate()
      .then(value => {
        console.log(value);
        this.updating = false;
      })
      .catch(reason => {
        console.log(reason);

        this.updating = false;
      });
  }

  public download() {
    // this.downloadService.download(file);
  }
  public async ngOnInit() {
    this.dataService.chapter2 = new Chapter2();
    this.navServices.notesSettings = false;
    this.dataService.chapter2.title = 'Settings';

    this.currentDatabaseList = find(this.databaseService.databaseList, d => {
      return d.name === location.host.split('.')[0];
    });
  }
  public reset() {
    // localForage.clear();
  }
  public saveSettings() {
    this.saveState.save();
  }
}
