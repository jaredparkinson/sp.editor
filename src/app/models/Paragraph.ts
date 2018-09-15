import { Verse } from './Verse';

export class Paragraph {
  public verses: Verse[] = [];
  constructor(paragraph: HTMLElement) {
    Array.prototype.slice
      .call(paragraph.querySelectorAll('span.verse'))
      .forEach(v => {
        this.verses.push(new Verse(v));
      });
  }
  /**
   * setHighlight
   */
  public setHighlight(verseNums: number[]) {
    this.verses.forEach(verse => {
      if (verseNums.includes(verse.num)) {
        verse.highlight = true;
      }
    });
  }
}
