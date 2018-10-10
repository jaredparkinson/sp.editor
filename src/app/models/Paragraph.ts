import { Verse } from './Verse';

import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
export class Paragraph {
  public verses: Verse[] = [];
  public id: number;
  constructor(
    paragraph: HTMLElement,
    verseNums: number[],
    contextNums: number[],
    tgGs: boolean,
    count: number
  ) {
    this.id = count;
    let sel = 'span.verse';
    if (tgGs) {
      sel = 'li';
    }
    _.each(paragraph.querySelectorAll('.verse'), verse => {
      _.each(verse.querySelectorAll('w'), wTag => {
        wTag.setAttribute('n', verse.id + '-' + wTag.getAttribute('n'));
        // console.log(wTag.getAttribute('n'));
      });
    });
    _.each(paragraph.querySelectorAll(sel), v => {
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
    _.forEach(this.verses, v => {
      v.resetHighlight();
    });
  }
}
