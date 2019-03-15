import { Injectable } from '@angular/core';
import { Chapter2, Note, Paragraphs, Verse } from '../modelsJson/Chapter';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  chapter2: Chapter2 = new Chapter2();
  paragraphs: Paragraphs = new Paragraphs();
  noteVisibility: Map<string, boolean> = new Map();
  verses: Verse[] = [];
  notea: Map<string, Note> = new Map<string, Note>();
  constructor() {}
}
