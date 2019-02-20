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
    let promises = [];
    let promises2 = [];
    this.download(file).subscribe(data => {
      console.log(data);

      jszip.loadAsync(data).then(zip => {
        zip.forEach(async file2 => {
          if (zip.file(file2)) {
            console.log(file2);

            promises.push(zip.file(file2).async('text'));
            // const value = await zip.file(file2).async('text');
            // await this.dataBaseService.put(value);
            // console.log(`Finished ${file2}`);
          }
        });

        Promise.all(promises).then(async (scriptureFiles: string[]) => {
          scriptureFiles.forEach(scriptureFile => {
            promises2.push(this.dataBaseService.bulkUpdate(scriptureFile));
          });
          Promise.all(promises2)
            .then(() => {
              console.log('all Finished');
            })
            .catch(reason => {
              console.log(reason);
            });
        });

        console.log('oiasdjfoaisdjf');
        // Promise.all(this.loading(zip)).then(async (value: any[]) => {
        //   value.forEach(v => {
        //     promises2.push(this.dataBaseService.put(v));
        //   });
        //   console.log(promises2.length);

        //   const results = await Promise.all(
        //     promises2.map(p => {
        //       p.catch(e => e);
        //     }),
        //   );

        //   file.downloaded = true;
        //   file.downloading = false;
        //   console.log('aoisdjfioasdjfoiasjdf');

        //   // Promise.all(promises2).then(ddd => {
        //   //   ddd.forEach(d => {
        //   //     console.log(d);
        //   //   });
        //   //   console.log(ddd);
        //   // });
        // });
      });

      // Promise.all(promises).then(() => {});
    });
  }

  private loading(zip: jszip) {
    let promise = [];
    zip.forEach(async file2 => {
      if (zip.file(file2)) {
        promise.push(zip.file(file2).async('text'));
        // .then(value => {
        //   promises.push(this.dataBaseService.put(value));
        // });
      }
    });

    return promise;
  }

  download(file: Download) {
    return this.httpClient.get(file.fileName, {
      observe: 'body',
      responseType: 'arraybuffer',
    });

    // .subscribe(async data => {
    //   return data;
    //   // const i = pako.gzip(, {});
    //   // const asdf = await this.loadData(data);
    //   // console.log(asdf);

    //   await this.loadData(data).then(() => {
    //     this.downloads[0].downloaded = true;
    //   });
    //   // this.downloads[0] = true;

    //   // Promise.all(this.loadData(data)).then(() => {
    //   // });
    // });
  }

  private loadData(data: ArrayBuffer) {
    return new Promise<void>(
      (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        jszip.loadAsync(data).then(zip => {
          console.log(zip);
          zip.forEach(async file2 => {
            // console.log(file2);
            if (zip.file(file2)) {
              const output = await zip.file(file2).async('text');
              await this.dataBaseService.put(output);
              // zip
              //   .file(file2)
              //   .async('text')
              //   .then(async value => {
              //     await this.dataBaseService.put(value);
              //   });
              // promises.push(
              // );
            }
          });
          // return promises;
        });
        resolve(undefined);
      },
    );

    // return promises;
  }
}
