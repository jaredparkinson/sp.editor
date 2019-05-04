import { Injectable } from '@angular/core';
import { cloneDeep, filter, find, merge, uniq } from 'lodash';
// import * as debug from 'pouchdb-debug';
import PouchDB from 'pouchdb';
import databaselist from '../../assets/data/database-list.json';

import { HttpClient } from '@angular/common/http';
import { Chapter } from 'oith.models/dist';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public databaseList: Database[];

  public db = new PouchDB(location.hostname);
  public sdb = new PouchDB('alpha_oneinthinehand_all_eng');

  private tempAllDocs: PouchDB.Core.AllDocsResponse<{}>;
  constructor() {
    // PouchDB.plugin(PouchDBFind);
    // PouchDB.plugin(debug);
    // PouchDB.debug.enable('pouchdb:find');
  }

  public allDocs() {
    return this.db.allDocs();
  }

  public async bulkDocs(databaseName: string) {
    await (PouchDB as any).replicate(
      `https://sp_users:test@couch.parkinson.im/${databaseName}`,
      this.db,
    );
  }

  public compactDatabase() {
    const verseDb = new PouchDB(
      'https://sp_users:test@couch.parkinson.im/verses',
    );

    verseDb
      .compact()
      .then(value => {
        console.log(value);
      })
      .catch(reason => {
        console.log(reason);
      });
  }
  public async get(id: string): Promise<{}> {
    return this.db.get(id);
  }

  public async getDocumentCount() {
    const allDocs = await this.db.allDocs();

    console.log(allDocs.rows.length);
  }

  public async getRevision(id: string): Promise<string> {
    try {
      const rev = await this.db.get(id);

      return rev._rev as string;
    } catch {
      throw new Error('Item is not in the databawse');
    }
  }
  public async put(value: string) {
    const chaper = JSON.parse(value) as Chapter;

    chaper._rev = await this.getRevision(chaper._id);

    return this.db.put(chaper).catch(() => {});
  }

  public async setAllDocs() {
    this.tempAllDocs = await this.db.allDocs();
  }

  public async setDatabases() {
    const tempDatabases = localStorage.getItem('database-list');

    if (tempDatabases) {
      this.databaseList = JSON.parse(tempDatabases);
    } else {
      this.databaseList = [];
    }

    // const a = await axios.get('assets/data/database-list.json');
    // console.log(a.data);
    const dataDatabase = databaselist as Database[];

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

    localStorage.setItem('database-list', JSON.stringify(this.databaseList));
  }
  private addFiles(dataFile: string) {
  //   return new Promise(async resolve => {
  //     console.log(this.tempAllDocs);
  //     const scriptureFiles = JSON.parse(dataFile) as Chapter[];
  //     const verses = [];
  //     scriptureFiles.forEach(c => {
  //       c.verses.forEach(verse => {
  //         const v = cloneDeep(verse);
  //         v._id = c._id + v._id;
  //         v.wTags = undefined;
  //         verses.push(v);
  //       });
  //     });

  //     console.log(verses);
  //     if (scriptureFiles) {
  //       scriptureFiles.forEach((scriptureFile: any) => {
  //         const savedDoc = this.tempAllDocs.rows.filter(doc => {
  //           return doc.id === scriptureFile._id;
  //         });
  //         if (savedDoc && savedDoc.length > 0) {
  //           scriptureFile._rev = savedDoc[0].value.rev;
  //         }
  //       });
  //       this.db.bulkDocs(scriptureFiles).then(() => {
  //         resolve();
  //       });
  //     }
  //   });
  // }
}

export class DatabaseItem {
  public channel: string;
  public databaseName: string;
  public deleting = false;
  public downloaded = false;
  public downloading = false;
  public language: string;
  public title: string;
}

export class Database {
  public databaseItems: DatabaseItem[];
  public name: string;
}
