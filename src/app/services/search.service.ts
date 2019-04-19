import { Injectable } from '@angular/core';
import * as lunr from 'lunr';
import { Database, QueryResults } from 'sql.js';
import { DatabaseService } from './database.service';
import { filter } from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public index: lunr.Index;
  public indexes: lunr.Index[] = [];
  public verses: Array<{ id: string; text: string }>;
  public db: Database;

  constructor(private dataBaseService: DatabaseService) {}

  public search(searchTerm: string): Promise<QueryResults[] | undefined> {
    return new Promise<QueryResults[]>(async (resolve, reject) => {
      console.log(await this.dataBaseService.db.getIndexes());
      // console.log(
      //   await this.dataBaseService.db.createIndex({
      //     index: { fields: ['text'] },
      //   }),
      // );
      // console.log(PouchDB.debug);

      // this.dataBaseService.sdb
      //   .find({
      //     selector: { text: { $gt: searchTerm } },
      //     // limit: 100,
      //   })
      //   .then(v => {
      //     console.log(v);
      //   })
      //   .catch(reason => {
      //     console.log('olijasDFOIJASDFOIJASDFJOI');

      //     console.log(reason);
      //   });

      // this.dataBaseService.db
      //   .createIndex({ index: { fields: ['text'] } })
      //   .then(v => {
      //     console.log(v);
      //   })
      //   .catch(reason => {
      //     console.log(reason);
      //   });
      this.db
        ? resolve(
            this.db.exec(
              `select * from verse where text like '%${searchTerm}%' and not id like '%intro%'`,
            ),
          )
        : reject();
    });
    // let searchResults: lunr.Index.Result[] = []; // this.index.search(searchTerm);
    // return new Promise<lunr.Index.Result[] | undefined>((resolve, reject) => {
    //   this.indexes.forEach(i => {
    //     searchResults = searchResults.concat(i.search(searchTerm));
    //   });

    //   searchResults.length > 0 ? resolve(searchResults) : reject();
    // });
  }
  public searchCouchDB(searchTerm: string) {
    return new Promise((resolve, reject) => {
      this.dataBaseService.db.get('tg_eng_verses', {}).then(results => {
        const r = filter((results as any).data as [], (d: any) => {
          return (d.text as string).toLowerCase().includes(searchTerm);
        });
        r && r.length > 0 ? resolve(r) : reject();
      });
    });
  }
}
