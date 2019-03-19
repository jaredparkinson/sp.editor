import { Injectable } from '@angular/core';
import { Chapter2 } from '../modelsJson/Chapter';
import { Note } from '../modelsJson/Note';
import { Paragraph } from '../modelsJson/Paragraph';
import { Verse } from '../modelsJson/Verse';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  chapter2: Chapter2 = new Chapter2();
  paragraphs: Paragraph[] = [];
  noteVisibility: Map<string, boolean> = new Map();
  verses: Verse[] = [];
  notea: Map<string, Note> = new Map<string, Note>();
  header: Verse[] = [];
  constructor() {}
}
