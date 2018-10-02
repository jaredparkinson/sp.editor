import * as _ from 'underscore';
import { Verse } from './Verse';

export class Paragraph {
  public verses: Verse[] = [];
  constructor(
    paragraph: HTMLElement,
    verseNums: number[],
    contextNums: number[]
  ) {
    _.each(paragraph.querySelectorAll('span.verse'), v => {
      this.verses.push(new Verse(v as HTMLElement));
    });
    this.setHighlight2(verseNums, contextNums);
  }
  /**
   * setHighlight
   */
  public setHighlight2(verseNums: number[], contextNums: number[]) {
    _.each(this.verses, verse => {
      if (_.includes(verseNums, verse.num)) {
        verse.highlight = true;
      }
      if (_.includes(contextNums, verse.num)) {
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
