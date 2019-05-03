import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public chapter2: Chapter2 = new Chapter2();
  public header: Verse[] = [];
  public notea: Map<string, Note> = new Map<string, Note>();
  public noteVisibility: Map<string, boolean> = new Map();
  public paragraphs: Paragraph[] = [];
  public verses: Verse[] = [];
  constructor() {}
}
