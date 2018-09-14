import { Chapter } from './Chapter';

export class Book {
  public bookName: string;
  public chapters: Chapter[];
  public showChildren = false;
  constructor(book: HTMLElement) {
    this.bookName = book
      .querySelector('p.title')
      .innerHTML.replace('&nbsp;', ' ');
    this.chapters = [];
  }
}
