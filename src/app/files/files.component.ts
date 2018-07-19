import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Component, OnInit, NgModule } from '@angular/core';
import { File } from '../file';
import { FileManager } from '../filemanager';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  private baseFolder: string;
  private nav: string;
  private file: File;
  constructor(
    private fileManager: FileManager,
    private httpClient: HttpClient
  ) {
    // const gfs = require('graceful-fs');
    // this.fs = window.require('fs');
    // this.baseFolder = baseFolder;
    // this.file = new File(this.baseFolder);
    // this.fileManager.getChapers();
    //(this.baseFolder);
    // console.log(this.fileManager.getChapers());
  }

  ngOnInit() {}
}
