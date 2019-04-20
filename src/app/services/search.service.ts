import { Injectable } from '@angular/core';
import * as lunr from 'lunr';
import { Database, QueryResults } from 'sql.js';
import { DatabaseService } from './database.service';
import { filter } from 'lodash';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public index: lunr.Index;
  public indexes: lunr.Index[] = [];
  public verses: Array<{ id: string; text: string }>;
  public db: Database;

  constructor(
    private dataBaseService: DatabaseService,
    private httpClient: HttpClient,
  ) {}

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

  public searchLunr(searchTerm: string) {
    let searchResults: lunr.Index.Result[] = [];
    return new Promise<lunr.Index.Result[] | undefined>(
      async (resolve, reject) => {
        if (!this.index) {
          await this.loadSearch();
        }
        searchResults = this.index.search(searchTerm);

        searchResults.length > 0 ? resolve(searchResults) : reject();
      },
    );
  }

  private loadSearch() {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get('assets/data/chapters.json', { responseType: 'json' })
        .subscribe(
          data => {
            this.index = lunr.Index.load(data);

            resolve();
          },
          error => {
            reject();
          },
        );
    });
  }
}
