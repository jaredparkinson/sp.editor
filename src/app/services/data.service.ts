import { Injectable } from '@angular/core';
import { Chapter2, Paragraphs, Verses } from '../modelsJson/Chapter';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  chapter2: Chapter2 = new Chapter2();
  paragraphs: Paragraphs = new Paragraphs();
  noteVisibility: Map<string, boolean> = new Map();
  verses: Verses = new Verses();
  constructor() {}
}
