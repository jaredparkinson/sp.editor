import * as lodash from 'lodash';
import { Verse } from './Verse';
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
    lodash.each(paragraph.querySelectorAll('.verse'), verse => {
      lodash.each(verse.querySelectorAll('w'), wTag => {
        wTag.setAttribute('n', verse.id + '-' + wTag.getAttribute('n'));
        if (wTag.nextSibling && wTag.nextSibling.nodeName === '#text') {
          console.log((wTag.nextSibling.textContent = ''));
        }
        // console.log(wTag.getAttribute('n'));
      });
    });
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
    lodash.forEach(this.verses, v => {
      v.resetHighlight();
    });
  }
}
