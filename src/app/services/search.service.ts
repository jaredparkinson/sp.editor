import { Injectable } from '@angular/core';
import * as lunr from 'lunr';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public index: lunr.Index;
  public verses: Array<{ id: string; text: string }>;

  constructor() {}

  public search(searchTerm: string): Promise<lunr.Index.Result[] | undefined> {
    return new Promise<lunr.Index.Result[] | undefined>((resolve, reject) => {
      const searchResults = this.index.search(searchTerm);

      searchResults.length > 0 ? resolve(searchResults) : reject();
    });
  }
}
