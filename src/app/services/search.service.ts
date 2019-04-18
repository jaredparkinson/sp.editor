import { Injectable } from '@angular/core';
import * as lunr from 'lunr';
import { Database, QueryResults } from 'sql.js';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public index: lunr.Index;
  public indexes: lunr.Index[] = [];
  public verses: Array<{ id: string; text: string }>;
  public db: Database;

  constructor() {}

  public search(searchTerm: string): Promise<QueryResults[] | undefined> {
    return new Promise<QueryResults[]>((resolve, reject) => {
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
}
