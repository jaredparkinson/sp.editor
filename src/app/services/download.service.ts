import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jszip from 'jszip';
import * as localForage from 'localforage';
import * as lodash from 'lodash';
import { Download } from '../models/download';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  public downloads: Download[] = [];
  private forageRegex: RegExp = new RegExp(
    /(?!\\)[a-zA-Z0-9-_]+\\[a-zA-Z0-9-_]+(?=\.html.json)/,
  );
  constructor(
    private httpClient: HttpClient,
    private dataBaseService: DatabaseService,
  ) {
    this.downloads.push(
      new Download('assets/scriptures.zip', 'scriptures', false),
    );

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
  public downloadScriptures(file: Download) {
    this.dataBaseService.getDocumentCount();
    file.downloading = true;
    const promises = [];
    const promises2 = [];
    this.download(file).subscribe(async data => {
      console.log(data);
      await this.dataBaseService.setAllDocs();

      jszip.loadAsync(data).then(zip => {
        zip.forEach(async file2 => {
          if (zip.file(file2)) {
            console.log(file2);

            promises.push(zip.file(file2).async('text'));
          }
        });

        Promise.all(promises).then(async (scriptureFiles: string[]) => {
          scriptureFiles.forEach(scriptureFile => {
            promises2.push(this.dataBaseService.bulkDocs(scriptureFile));
          });
          Promise.all(promises2)
            .then(() => {
              file.downloaded = true;
              console.log('Finished');
            })
            .catch(reason => {
              console.log(reason);
            });
        });
      });
    });
  }

  download(file: Download) {
    return this.httpClient.get(file.fileName, {
      observe: 'body',
      responseType: 'arraybuffer',
    });
  }
}
