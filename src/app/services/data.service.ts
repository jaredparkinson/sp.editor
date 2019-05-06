import { Injectable } from '@angular/core';
import { Chapter, Note, Paragraph, Verse, W } from 'oith.models/dist';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public baseChapter: Chapter | undefined = new Chapter();
  public displayChapter: Chapter = new Chapter();
  public header: Verse[] = [];
  public notea: Map<string, Note> = new Map<string, Note>();
  public noteVisibility: Map<string, boolean> = new Map();
  public paragraphs: Paragraph[] = [];
  public verses: Verse[] = [];
  public wTags: W[] = [];
}
