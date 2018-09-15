export class Verse {
  public id: string;
  public innerHtml: string;
  public highlight = false;
  public num: number;
  constructor(verse: HTMLElement) {
    this.id = verse.id;
    this.innerHtml = verse.innerHTML;
    // this.highlight = verseNums.includes(parseInt(this.id.replace('p', ''), 10));
    this.num = parseInt(this.id.replace('p', ''), 10);
  }
}
