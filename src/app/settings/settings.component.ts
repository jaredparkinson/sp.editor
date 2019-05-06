import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
// import * as localForage from 'localforage';
import { find } from 'lodash';

import { Chapter } from 'oith.models/dist';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { Database } from '../services/Database';
import { DatabaseService } from '../services/database.service';
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
  public currentDatabaseList: Database | undefined = new Database();

  public updating = false;

  public constructor(
    public downloadService: DownloadService,
    public saveState: SaveStateService,
    public navServices: NavigationService,
    public chapterService: ChapterService,
    public swUpdate: SwUpdate,
    public editService: EditService,
    private dataService: DataService,
    private databaseService: DatabaseService,
  ) {}

  public async checkForUpdates(): Promise<void> {
    this.updating = true;

    try {
      await this.swUpdate.checkForUpdate();
    } catch (error) {
      console.log(error);
    }
    this.updating = false;

    // this.swUpdate
    //   .checkForUpdate()
    //   .then(value => {
    //     console.log(value);
    //     this.updating = false;
    //   })
    //   .catch(reason => {
    //     console.log(reason);

    //     this.updating = false;
    //   });
  }

  public async ngOnInit(): Promise<void> {
    this.dataService.chapter2 = new Chapter();
    this.navServices.notesSettings = false;
    this.dataService.chapter2.title = 'Settings';

    this.currentDatabaseList = find(
      this.databaseService.databaseList,
      (d): boolean => {
        return d.name === location.host.split('.')[0];
      },
    );
    // this.databaseService.setDatabases().then(() => {

    // });
  }
  public reset(): void {
    // localForage.clear();
  }
  public saveSettings(): void {
    this.saveState.save();
  }
}
