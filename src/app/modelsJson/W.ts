// export class Verses {
//   public verses: Verse[] = [];
//   private count = 0;
// }
export class W {
  public id: number[] = [];
  public classList: string[] = [];
  public refs: string[] = [];
  public visibleRefs: string[] = [];
  public text: string;
  public selected: boolean;
  clicked: boolean;
  visibleRefCount = 0;
  constructor(text: string) {
    this.text = text;
  }
}
