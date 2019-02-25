import { Injectable } from '@angular/core';
import { Chapter2 } from '../modelsJson/Chapter';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  chapter2: Chapter2 = new Chapter2();
  constructor() {}
}
