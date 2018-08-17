import { Chapter } from './Chapter';

export class Book {
  public bookName: string;
  public chapters: Chapter[];
  constructor(bookName: string) {
    this.bookName = bookName;
    this.chapters = [];
  }
}
