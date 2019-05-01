import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter } from 'lodash';
import * as lunr from 'lunr';
import { Database, QueryResults } from 'sql.js';
import { DatabaseService } from './database.service';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public db: Database;
  public index: lunr.Index;
  public indexes: lunr.Index[] = [];
  public verses: Array<{ id: string; text: string }>;

  constructor(private dataBaseService: DatabaseService) {}

  public search(searchTerm: string): Promise<QueryResults[] | undefined> {
    return new Promise<QueryResults[]>(async (resolve, reject) => {
      console.log(await this.dataBaseService.db.getIndexes());

      this.db
        ? resolve(
            this.db.exec(
              `select * from verse where text like '%${searchTerm}%' and not id like '%intro%'`,
            ),
          )
        : reject();
    });
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

  public async searchLunr(searchTerm: string) {
    // let searchResults: lunr.Index.Result[] = [];
    // // await this.loadSearch();
    // try {
    //   if (!this.index) {
    //     await this.loadSearch();
    //   }
    //   searchResults = this.index.search(searchTerm);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  // private async loadSearch() {
  //   try {

  //     this.index = lunr.Index.load(data);
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('File not found');
  //   }
  // }
}
