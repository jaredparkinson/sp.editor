import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { Download } from '../models/download';
import { DatabaseItem, DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  public downloads: Download[] = [
    new Download('beta_oneinthinehand', 'scriptures', false),
  ];
  constructor(
    // private httpClient: HttpClient,
    private dataBaseService: DatabaseService,
  ) {
    const tempDownloads = localStorage.getItem('downloads');
    if (tempDownloads) {
      this.downloads = JSON.parse(tempDownloads) as [];
    } else {
    }
  }

  public delete(file: Download) {
    this.dataBaseService.db.allDocs().then(docs => {
      docs.rows.map(row => {
        this.dataBaseService.db.remove(row.id, row.value.rev);
      });
      file.downloading = false;
      file.downloaded = false;
    });
  }

  public async download(file: Download) {
    return axios.get(file.fileName);
    // return this.httpClient.get(file.fileName, {
    //   observe: 'body',
    //   responseType: 'arraybuffer',
    // });
  }
  public async downloadScriptures(file: Download) {
    file.downloaded = false;
    file.downloading = true;

    this.dataBaseService
      .bulkDocs(file.fileName)
      .then(() => {
        console.log('Finished');
        file.downloading = false;
        file.downloaded = true;
        file.deleting = false;
        localStorage.setItem('downloads', JSON.stringify(this.downloads));
      })
      .catch(() => {
        console.log('Failed, try again');
        file.downloading = false;
      });
    return;
  }
  public async downloadScriptures2(file: DatabaseItem) {
    file.downloaded = false;
    file.downloading = true;
    const fileName = `${file.channel}_oneinthinehand_${file.databaseName}_${
      file.language
    }`;

    console.log(fileName);
    // return;
    this.dataBaseService
      .bulkDocs(fileName)
      .then(() => {
        console.log('Finished');
        file.downloading = false;
        file.downloaded = true;
        file.deleting = false;

        localStorage.setItem(
          'database-list',
          JSON.stringify(this.dataBaseService.databaseList),
        );
      })
      .catch(() => {
        console.log('Failed, try again');
        file.downloading = false;
      });
    return;
  }
}
