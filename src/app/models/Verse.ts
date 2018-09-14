export class Verse {
  public id: string;
  public innerHtml: string;
  public highlight = false;
  constructor(verse: HTMLElement) {
    this.id = verse.id;
    this.innerHtml = verse.innerHTML;
  }
}
