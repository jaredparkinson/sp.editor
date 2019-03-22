// export class Verses {
//   public verses: Verse[] = [];
//   private count = 0;

export interface IW {
  id: number[];
  classList: string[] | undefined;
  refs: string[] | undefined;
  visibleRefs: string[] | undefined;
  text: string | undefined;
}

export class rubyW implements IW {
  public id: number[] = [];
  public classList: string[] | undefined = undefined;
  public refs: string[] | undefined = undefined;
  public visibleRefs: string[] | undefined = undefined;
  public isLink: boolean = true;
  public text: string | undefined = undefined;
  public type: string;
}
export class aW implements IW {
  public id: number[] = [];
  public classList: string[] | undefined = [];
  public refs: string[] | undefined = undefined;
  public visibleRefs: string[] | undefined = [];
  public isLink: boolean = true;
  public text: string | undefined = undefined;
  public href: string | null;
  public childWTags: W[] = [];
  public type: string;
} // }
export class W implements IW {
  public id: number[] = [];
  public classList: string[] = [];
  public refs: string[] = [];
  public visibleRefs: string[] = [];
  public text: string;
  public selected: boolean;
  public wTag: boolean = true;
  public type: string;
  clicked: boolean;
  visibleRefCount = 0;
  constructor(text: string) {
    this.text = text;
  }
}
