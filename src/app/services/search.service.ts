import { Injectable } from '@angular/core';
import * as lunr from 'lunr';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public index: lunr.Index;
  public indexes: lunr.Index[] = [];
  public verses: Array<{ id: string; text: string }>;

  constructor() {}

  public search(searchTerm: string): Promise<lunr.Index.Result[] | undefined> {
    let searchResults: lunr.Index.Result[] = []; // this.index.search(searchTerm);
    return new Promise<lunr.Index.Result[] | undefined>((resolve, reject) => {
      this.indexes.forEach(i => {
        searchResults = searchResults.concat(i.search(searchTerm));
      });

      searchResults.length > 0 ? resolve(searchResults) : reject();
    });
  }
}
