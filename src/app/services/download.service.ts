import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Download } from '../models/download';
import { DatabaseService } from './database.service';
import { DatabaseItem } from './DatabaseItem';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  public downloads: Download[] = [
    new Download('beta_oneinthinehand', 'scriptures', false),
  ];
  constructor(
    private httpClient: HttpClient,
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

  public async download(file: Download): Promise<Observable<object>> {
    return this.httpClient.get(file.fileName);
  }
  public async downloadScriptures(file: Download): Promise<void> {
    file.downloaded = false;
    file.downloading = true;

    this.dataBaseService
      .bulkDocs(file.fileName)
      .then(
        (): void => {
          console.log('Finished');
          file.downloading = false;
          file.downloaded = true;
          file.deleting = false;
          localStorage.setItem('downloads', JSON.stringify(this.downloads));
        },
      )
      .catch(
        (): void => {
          console.log('Failed, try again');
          file.downloading = false;
        },
      );
    return;
  }
  public async downloadScriptures2(file: DatabaseItem): Promise<void> {
    file.downloaded = false;
    file.downloading = true;
    const fileName = `${file.channel}_oneinthinehand_${file.databaseName}_${
      file.language
    }`;

    console.log(fileName);
    // return;
    this.dataBaseService
      .bulkDocs(file.databaseName)
      .then(
        (): void => {
          console.log('Finished');
          file.downloading = false;
          file.downloaded = true;
          file.deleting = false;

          localStorage.setItem(
            'database-list',
            JSON.stringify(this.dataBaseService.databaseList),
          );
        },
      )
      .catch(
        (): void => {
          console.log('Failed, try again');
          file.downloading = false;
        },
      );
    return;
  }
}
