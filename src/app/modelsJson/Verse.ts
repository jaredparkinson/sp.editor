export class Verse {
  public id: string;
  // public innerHtml: string;
  public highlight = false;
  // public wTags: WTag[] = [];
  public wTags2: Array<
    [string, string, string, string, string, string, number, string[], boolean]
  > = [];

  public context = false;
  public num: number;
}
