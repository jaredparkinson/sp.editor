import generate from 'nanoid/generate';

// export class Verses {
//   public verses: Verse[] = [];
//   private count = 0;
// import uuid = require('uuid-js')
// import {  } from "nanoid";
export interface IW {
  classList: string[] | undefined;
  id: number[];
  refs: string[] | undefined;
  text: string | undefined;
  visibleRefs: string[] | undefined;
}

export class rubyW implements IW {
  public classList: string[] | undefined = undefined;
  public id: number[] = [];
  public isLink: boolean = true;
  public refs: string[] | undefined = undefined;
  public text: string | undefined = undefined;
  public type: string;
  public visibleRefs: string[] | undefined = undefined;
}
export class aW implements IW {
  public childWTags: W[] = [];
  public classList: string[] | undefined = [];
  public href: string | null;
  public id: number[] = [];
  public isLink: boolean = true;
  public refs: string[] | undefined = undefined;
  public text: string | undefined = undefined;
  public type: string;
  public visibleRefs: string[] | undefined = [];
} // }
export class W implements IW {
  public classList: string[] = [];
  public clicked: boolean;
  public highlightRefs: string[] = [];
  public id: number[] = [];
  public refs: string[] = [];
  public selected: boolean;
  public text: string;
  public type: string;
  public visibleRefCount = 0;
  public visibleRefs: string[] = [];
  public wTag: boolean = true;
  constructor(ids: number[]) {
    this.id = ids;
    this.refs = [];
    this.refs.push(generate('1234567890abcdef', 10));

    console.log(this.refs);
  }
}
