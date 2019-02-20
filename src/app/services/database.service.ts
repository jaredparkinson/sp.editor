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

  public getRevision(id: string): string {
    let _rev = '';

    // this.db.put()
    this.db
      .get(id)
      .then(value => {
        _rev = value._rev;
      })
      .catch(() => {
        _rev = null;
      });

    return _rev;
  }
  public async put(value: string): Promise<any> {
    const chaper = JSON.parse(value) as Chapter2;

    await this.db
      .get(chaper._id)
      .then(value => {
        chaper._rev = value._rev;
        // console.log();
        return this.db.put(chaper);
        // resolve(this.db.put(chaper));
      })
      .catch(() => {
        return this.db.put(chaper);
      });
  }
}
