import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Download } from '../models/download';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  public downloads: Download[] = [
    new Download('alpha_oneinthinehand', 'scriptures', false),
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

    // const testaments = [
    //   'bd',
    //   'bible',
    //   'bible-chron',
    //   'bible-maps',
    //   'bible-photos',
    //   'bofm',
    //   'dc-testament',
    //   'gs',
    //   'harmony',
    //   'history-maps',
    //   'history-photos',
    //   'jst',
    //   'nt',
    //   'ot',
    //   'pgp',
    //   'quad',
    //   'tg',
    //   'triple',
    //   'triple-index'
    // ];

    // testaments.forEach(async testament => {
    //   const temp = await localForage.getItem(testament);
    //   if (temp) {
    //     this.downloads.push(JSON.parse(temp as string) as Download);
    //   } else {
    //     const download = new Download(
    //       'assets/scriptures/' + testament + '.zip',
    //       testament,
    //       false
    //     );
    //     this.downloads.push(download);
    //     localForage.setItem(download.title, JSON.stringify(download));
    //   }
    // });
  }
  public async downloadScriptures(file: Download) {
    file.downloaded = false;
    file.downloading = true;
    // await this.dataBaseService.db.allDocs().then(docs => {
    //   const deleteRows = [];
    //   docs.rows.forEach(row => {
    //     const tempRow = { _rev: row.value.rev, _id: row.id, _deleted: false };
    //     console.log(tempRow);
    //     deleteRows.push(tempRow);
    //   });
    //   this.dataBaseService.db.bulkDocs(deleteRows);
    // });
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
    // this.dataBaseService.getDocumentCount();
    // file.downloading = true;
    // const promises = [];
    // const promises2 = [];
    // this.download(file).subscribe(async data => {
    //   console.log(data);
    //   await this.dataBaseService.setAllDocs();

    //   jszip.loadAsync(data).then(zip => {
    //     zip.forEach(async file2 => {
    //       if (zip.file(file2)) {
    //         console.log(file2);

    //         promises.push(zip.file(file2).async('text'));
    //       }
    //     });

    //     Promise.all(promises).then(async (scriptureFiles: string[]) => {
    //       scriptureFiles.forEach(scriptureFile => {
    //         promises2.push(this.dataBaseService.bulkDocs(scriptureFile));
    //       });
    //       Promise.all(promises2)
    //         .then(() => {
    //           file.downloaded = true;
    //           console.log('Finished');
    //         })
    //         .catch(reason => {
    //           console.log(reason);
    //         });
    //     });
    //   });
    // });
  }

  delete(file: Download) {
    this.dataBaseService.db.allDocs().then(docs => {
      docs.rows.map(row => {
        this.dataBaseService.db.remove(row.id, row.value.rev);
      });
      file.downloading = false;
      file.downloaded = false;
    });
    // file.deleting = false;
    // this.dataBaseService.allDocs().then(docs => {
    //   const deleteRows = [];

    //   docs.rows.forEach(row => {
    //     const tempRow = { _rev: row.value.rev, _id: row.id, _deleted: true };
    //     console.log(tempRow);
    //     deleteRows.push(tempRow);
    //   });

    //   file.deleting = true;
    //   file.downloading = false;
    //   file.downloaded = false;
    //   console.log(file);

    //   localStorage.setItem('downloads', JSON.stringify(this.downloads));
    // });
  }

  download(file: Download) {
    return this.httpClient.get(file.fileName, {
      observe: 'body',
      responseType: 'arraybuffer',
    });
  }
}
