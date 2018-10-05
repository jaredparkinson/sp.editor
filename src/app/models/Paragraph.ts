import { Verse } from './Verse';

import * as lodash from 'lodash';
export class Paragraph {
  public verses: Verse[] = [];
  constructor(
    paragraph: HTMLElement,
    verseNums: number[],
    contextNums: number[],
    tgGs: boolean
  ) {
    let sel = 'span.verse';
    if (tgGs) {
      sel = 'li';
    }
    lodash.each(paragraph.querySelectorAll(sel), v => {
      this.verses.push(new Verse(v as HTMLElement));
    });
    this.setHighlight2(verseNums, contextNums);
  }
  /**
   * setHighlight
   */
  public setHighlight2(verseNums: number[], contextNums: number[]) {
    lodash.each(this.verses, verse => {
      if (lodash.includes(verseNums, verse.num)) {
        verse.highlight = true;
      }
      if (lodash.includes(contextNums, verse.num)) {
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
