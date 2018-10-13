import { WTag } from './WTag';

export class Verse {
  public id: string;
  // public innerHtml: string;
  public highlight = false;
  public wTags: WTag[] = [];
  public context = false;
  public num: number;
}
