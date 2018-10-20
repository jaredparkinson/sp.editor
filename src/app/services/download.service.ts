import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jszip from 'jszip';
import * as localForage from 'localforage';
import * as _ from 'lodash';
import * as pako from 'pako';
import { Download } from '../models/download';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  public downloads: Download[] = [];
  private forageRegex: RegExp = new RegExp(
    /(?!\\)[a-zA-Z0-9-_]+\\[a-zA-Z0-9-_]+(?=\.html)/
  );
  constructor(private httpClient: HttpClient) {
    const testaments = [
      'bd',
      'bible',
      'bible-chron',
      'bible-maps',
      'bible-photos',
      'bofm',
      'dc-testament',
      'gs',
      'harmony',
      'history-maps',
      'history-photos',
      'jst',
      'nt',
      'ot',
      'pgp',
      'quad',
      'tg',
      'triple',
      'triple-index'
    ];

    testaments.forEach(async testament => {
      const temp = await localForage.getItem(testament);
      if (temp) {
        this.downloads.push(JSON.parse(temp as string) as Download);
      } else {
        const download = new Download(
          'assets/scriptures/' + testament + '.zip',
          testament,
          false
        );
        this.downloads.push(download);
        localForage.setItem(download.title, JSON.stringify(download));
      }
    });
  }
  download(file: Download) {
    file.downloading = true;
    this.httpClient
      .get(file.fileName, {
        observe: 'body',
        responseType: 'arraybuffer'
      })
      .subscribe(async data => {
        // const i = pako.gzip(, {});
        let c = 0;
        const zip = await jszip.loadAsync(data);
        console.log(zip);

        await zip.forEach(async file2 => {
          const contents = await zip.file(file2).async('text');
          // localStorage.setItem(file2, contents);
          const saveName = this.forageRegex.exec(file2).toString();

          const test = await localForage.getItem(saveName);
          // console.log(test !== null);
          if (!test) {
            c++;
            await localForage.setItem(saveName, contents).then(() => {
              console.log('finished ' + saveName + zip.files.length);
            });
            file.downloading = false;
            file.downloaded = true;
            localForage.setItem(file.title, JSON.stringify(file));
            localForage.setItem(file.title, JSON.stringify(file));
          } else {
            file.downloading = false;
            file.downloaded = true;
            localForage.setItem(file.title, JSON.stringify(file));
          }
        });
        // console.log(zip);

        console.log('Finished');

        // pako.inflate(data);
      });
  }
}
