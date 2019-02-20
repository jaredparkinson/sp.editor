import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import { Chapter2 } from '../modelsJson/Chapter';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public db = new PouchDB('alpha.oneinthinehand.org');
  private tempAllDocs: PouchDB.Core.AllDocsResponse<{}>;
  constructor() {}

  async allDocs() {
    console.log(await this.db.allDocs());
  }
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
  }

  public async setAllDocs() {
    this.tempAllDocs = await this.db.allDocs();
  }

  public bulkDocs(dataFile: string) {
    return new Promise(resolve => {
      console.log(this.tempAllDocs);

      const scriptureFiles = JSON.parse(dataFile) as [];

      if (scriptureFiles) {
        scriptureFiles.forEach((scriptureFile: any) => {
          const savedDoc = this.tempAllDocs.rows.filter(doc => {
            return doc.id == scriptureFile._id;
          });

          if (savedDoc && savedDoc.length > 0) {
            scriptureFile._rev = savedDoc[0].value.rev;
          }
        });

        this.db.bulkDocs(scriptureFiles).then(() => {
          resolve();
        });
      }
    });
  }
}
