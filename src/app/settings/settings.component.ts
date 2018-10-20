import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as jszip from 'jszip';
import * as localForage from 'localforage';
import * as _ from 'lodash';
import * as pako from 'pako';
import { DownloadService } from '../services/download.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private forageRegex: RegExp = new RegExp(
    /(?!\\)[a-zA-Z0-9-_]+\\[a-zA-Z0-9-_]+(?=\.html)/
  );
  constructor(
    public saveState: SaveStateService,
    public navServices: NavigationService,
    private httpClient: HttpClient,
    private downloadService: DownloadService
  ) {}

  ngOnInit() {}

  download(file: string) {
    // this.downloadService.download(file);
  }
}
