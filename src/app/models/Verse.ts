export class Verse {
  public id: string;
  public innerHtml: string;
  public highlight = false;
  constructor(verse: HTMLElement, verseNums: number[]) {
    this.id = verse.id;
    this.innerHtml = verse.innerHTML;
    this.highlight = verseNums.includes(parseInt(this.id.replace('p', ''), 10));
  }
}
