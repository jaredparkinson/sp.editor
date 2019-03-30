import { Injectable } from '@angular/core';
import * as lunr from 'lunr';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public index: lunr.Index;
  constructor() {}
}
