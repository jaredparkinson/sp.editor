export class Verse {
  public id: string;
  // public innerHtml: string;
  public highlight = false;
  public classList = '';
  public disabled = false;
  // public wTags: WTag[] = [];
  public wTags2: Array<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      number,
      string[],
      string[],
      boolean,
      boolean
    ]
  > = [];

  public context = false;
  public num: number;
}
