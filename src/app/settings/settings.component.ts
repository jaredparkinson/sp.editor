import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
// import * as localForage from 'localforage';
import { first, find } from 'lodash';
import { Chapter2 } from '../modelsJson/Chapter';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { DownloadService } from '../services/download.service';
import { EditService } from '../services/EditService';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { HttpClient } from '@angular/common/http';
import { Database, DatabaseService } from '../services/database.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public currentDatabaseList: Database = new Database();
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

  public updating = false;
  async ngOnInit() {
    this.dataService.chapter2 = new Chapter2();
    this.navServices.notesSettings = false;
    this.dataService.chapter2.title = 'Settings';

    this.currentDatabaseList = find(this.databaseService.databaseList, d => {
      return d.name === location.host.split('.')[0];
    });
  }

  download() {
    // this.downloadService.download(file);
  }
  reset() {
    // localForage.clear();
  }
  saveSettings() {
    this.saveState.save();
  }

  async checkForUpdates() {
    if (!this.temp)
      this.databaseService.db
        .get('testtesttest')
        .then(value => {
          this.temp = value;
          console.log(this.temp);
        })
        .catch(() => {
          this.httpClient
            .get('assets/data/search_index.json', { responseType: 'text' })
            .subscribe(data => {
              this.temp = JSON.parse(data);
              // localStorage.setItem('search_index', JSON.stringify(this.temp));
              console.log('Finished');
              this.temp._id = 'testtesttest';
              this.databaseService.db.put(this.temp);
            });
        });
    else {
      this.temp = undefined;
    }
    return;
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
}
