import { Params } from '@angular/router';
export class ChapterParams {
  public book: string;
  public chapter: string;
  public highlighting: string[];
  public id: string;
  public language: string;
  public constructor(params: Params, language: string) {
    this.book = params['book'];
    this.chapter = params['chapter'].toString();
    this.highlighting = this.chapter.split('.').reverse();
    this.language = params['language'] ? params['language'] : language;
    this.id = `${this.book}-${this.highlighting.pop()}-${this.language}`;
  }
}
