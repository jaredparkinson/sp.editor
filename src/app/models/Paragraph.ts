import { Verse } from './Verse';

export class Paragraph {
  public verses: Verse[] = [];
  constructor(paragraph: HTMLElement) {
    paragraph.querySelectorAll('span.verse').forEach(v => {
      console.log(v);
    });
  }
}
