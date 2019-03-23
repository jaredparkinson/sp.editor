import { Injectable } from '@angular/core';
import { cloneDeep, merge, find, filter, uniq } from 'lodash';
// import * as PouchDB from 'pouchdb/dist/pouchdb';
// import WorkerPouch from 'worker-pouch';
import * as PouchDBFind from 'pouchdb-find';
import * as WorkerPouch from 'worker-pouch';

import { Chapter2 } from '../modelsJson/Chapter';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  setDatabases() {
    return new Promise<void>((resolve: (resolveValue: void) => void) => {
      const tempDatabases = localStorage.getItem('database-list');

      if (tempDatabases) {
        this.databaseList = JSON.parse(tempDatabases);
      } else {
        this.databaseList = [];
      }

      this.httpClient
        .get('assets/data/database-list.json', {
          responseType: 'text',
        })
        .subscribe(data => {
          const dataDatabase = JSON.parse(data) as Database[];

          dataDatabase.forEach(item => {
            const existingItem = find(this.databaseList, (d: Database) => {
              return d.name === item.name;
            });

            if (existingItem) {
              merge(existingItem.databaseItems, item.databaseItems);
              existingItem.databaseItems = uniq(existingItem.databaseItems);
              filter(existingItem.databaseItems, (i: DatabaseItem) => {
                return !i.downloaded && i.downloading;
              }).forEach(i => {
                i.downloading = false;
              });
            } else {
              this.databaseList.push(item);
            }
          });

          localStorage.setItem(
            'database-list',
            JSON.stringify(this.databaseList),
          );

          resolve(undefined);
        });
    });
  }
  // public PouchDB = require('pouchdb-browser');
  // public db = new PouchDB('https://couch.parkinson.im/alpha_oneinthinehand');
  public db = new PouchDB('alpha.oneinthinehand.org');

  public databaseList: Database[];
  // public db = new PouchDB('http://localhost:5984/alpha_oneinthinehand');
  private tempAllDocs: PouchDB.Core.AllDocsResponse<{}>;
  constructor(private httpClient: HttpClient) {
    // (<any>PouchDB).adapter('worker', WorkerPouch);
    // this.db = new PouchDB('alpha.oneinthinehand.org');
    // PouchDB.plugin('pouchdb-find');
    PouchDB.plugin(PouchDBFind);
    // this.db.createIndex({ index: { fields: ['verse'] } });
  }

  allDocs() {
    return this.db.allDocs();
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

  public bulkDocs(databaseName: string) {
    // await PouchDB.sync(
    //   this.db,
    //   'https://couch.parkinson.im/alpha_oneinthinehand',
    // );
    // this.db.sync('http://localhost:5984/ggg');

    return new Promise<void>(async resolve => {
      await (PouchDB as any).replicate(
        `https://sp_users:test@couch.parkinson.im/${databaseName}`,
        this.db,
      );
      resolve();
    });
    // return this.addFiles(dataFile);
  }

  private addFiles(dataFile: string) {
    return new Promise(async resolve => {
      console.log(this.tempAllDocs);
      const scriptureFiles = JSON.parse(dataFile) as Chapter2[];
      const verses = [];
      scriptureFiles.forEach(c => {
        c.verses.forEach(verse => {
          const v = cloneDeep(verse);
          v._id = c._id + v._id;
          v.wTags = undefined;
          verses.push(v);
        });
      });
      // await this.db.bulkDocs(verses);
      console.log(verses);
      if (scriptureFiles) {
        scriptureFiles.forEach((scriptureFile: any) => {
          const savedDoc = this.tempAllDocs.rows.filter(doc => {
            return doc.id === scriptureFile._id;
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

export class DatabaseItem {
  public title: string;
  public databaseName: string;
  public channel: string;
  public language: string;
  public downloaded = false;
  public downloading = false;
  public deleting = false;
}

export class Database {
  public name: string;
  public databaseItems: DatabaseItem[];
}
