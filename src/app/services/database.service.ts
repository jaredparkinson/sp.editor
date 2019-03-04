import { Injectable } from '@angular/core';
import * as lodash from 'lodash';
// import * as PouchDB from 'pouchdb/dist/pouchdb';
// import WorkerPouch from 'worker-pouch';
import * as PouchDBFind from 'pouchdb-find';
import * as WorkerPouch from 'worker-pouch';

import { Chapter2 } from '../modelsJson/Chapter';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  // public PouchDB = require('pouchdb-browser');
  // public db = new PouchDB('http://localhost:5984//ggg');
  public db = new PouchDB('alpha.oneinthinehand.org');
  private tempAllDocs: PouchDB.Core.AllDocsResponse<{}>;
  constructor() {
    // (<any>PouchDB).adapter('worker', WorkerPouch);
    // this.db = new PouchDB('alpha.oneinthinehand.org');
    // PouchDB.plugin('pouchdb-find');
    PouchDB.plugin(PouchDBFind);
    // this.db.createIndex({ index: { fields: ['verse'] } });
  }

  async allDocs() {
    console.log(await this.db.allDocs());
  }
  public async get(id: string): Promise<{}> {
    // console.log(await this.db.find({ selector: { verse: 'jethro' } }));
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

  public async bulkDocs(dataFile: string) {
    await PouchDB.sync(this.db, 'http://localhost:5984/ggg');
    // this.db.sync('http://localhost:5984/ggg');
    // return new Promise(async resolve => {
    //   console.log(this.tempAllDocs);

    //   const scriptureFiles = JSON.parse(dataFile) as Chapter2[];
    //   const verses = [];
    //   scriptureFiles.forEach(c => {
    //     c.verses.verses.forEach(verse => {
    //       const v = lodash.cloneDeep(verse);
    //       v._id = c._id + v.id;
    //       v.wTags = undefined;
    //       verses.push(v);
    //     });
    //   });
    //   // await this.db.bulkDocs(verses);

    //   console.log(verses);

    //   if (scriptureFiles) {
    //     scriptureFiles.forEach((scriptureFile: any) => {
    //       const savedDoc = this.tempAllDocs.rows.filter(doc => {
    //         return doc.id == scriptureFile._id;
    //       });

    //       if (savedDoc && savedDoc.length > 0) {
    //         scriptureFile._rev = savedDoc[0].value.rev;
    //       }
    //     });

    //     this.db.bulkDocs(scriptureFiles).then(() => {
    //       resolve();
    //     });
    //   }
    // });
  }
}
