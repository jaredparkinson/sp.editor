import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import { Chapter2 } from '../modelsJson/Chapter';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  async allDocs() {
    console.log(await this.db.allDocs());
  }
  public db = new PouchDB('alpha.oneinthinehand.org');
  constructor() {}

  public get(id: string): Promise<{}> {
    return this.db.get(id);
  }

  public async getDocumentCount() {
    const allDocs = await this.db.allDocs();

    console.log(allDocs.rows.length);
  }

  public getRevision(id: string): Promise<string> {
    return new Promise<string>(
      (
        resolve: (resolveValue: string) => void,
        reject: (rejectValue: string) => void,
      ) => {
        // this.db.put()
        this.db
          .get(id)
          .then(value => {
            resolve(value._rev);
          })
          .catch(() => {
            resolve(undefined);
          });
      },
    );
  }
  public async put(value: string) {
    const chaper = JSON.parse(value) as Chapter2;

    chaper._rev = await this.getRevision(chaper._id);

    return this.db.put(chaper).catch(() => {});

    // await this.db
    //   .get(chaper._id)
    //   .then(value => {
    //     chaper._rev = value._rev;
    //     // console.log();
    //     return this.db.put(chaper);
    //     // resolve(this.db.put(chaper));
    //   })
    //   .catch(() => {
    //     return this.db.put(chaper);
    //   });
  }

  public bulkUpdate(dataFile: string) {
    this.db.allDocs().then(allDocs => {
      console.log(allDocs);

      const scriptureFiles = JSON.parse(dataFile) as [];

      if (scriptureFiles) {
        scriptureFiles.forEach((scriptureFile: any) => {
          const savedDoc = allDocs.rows.filter(doc => {
            return doc.id == scriptureFile._id;
          });

          if (savedDoc && savedDoc.length > 0) {
            scriptureFile._rev = savedDoc[0].value.rev;
          }
        });

        this.db.bulkDocs(scriptureFiles);
        // console.log(scriptureFiles);
      }
    });
  }
}
