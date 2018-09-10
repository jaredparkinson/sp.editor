import { Chapter } from './Chapter';

export class Book {
  public bookName: string;
  public chapters: Chapter[];
  public showChildren = false;
  constructor(bookName: string) {
    this.bookName = bookName;
    this.chapters = [];
  }
}
