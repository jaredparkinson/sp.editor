import { Verse } from './Verse';

export class Paragraph {
  public verses: Verse[] = [];
  constructor(
    paragraph: HTMLElement,
    verseNums: number[],
    contextNums: number[]
  ) {
    Array.prototype.slice
      .call(paragraph.querySelectorAll('span.verse'))
      .forEach(v => {
        this.verses.push(new Verse(v));
      });

    this.setHighlight2(verseNums, contextNums);
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
  public setHighlight2(verseNums: number[], contextNums: number[]) {
    this.verses.forEach(verse => {
      if (verseNums.includes(verse.num)) {
        verse.highlight = true;
      }
      if (contextNums.includes(verse.num)) {
        verse.context = true;
      }
    });
  }
  /**
   * resetHighlight()
   */
  public resetHighlight() {
    this.verses.forEach(v => {
      v.resetHighlight();
    });
  }
}
