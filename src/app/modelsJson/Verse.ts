import { W } from './W';
export class Verse {
  public _id = '';
  public id = '';
  public text = '';
  public wTags: W[] = [];
  public header: boolean;
  // public builtWTags: W[] = [];
  public highlight = false;
  public context = false;
  constructor(element: Element) {
    this._id = element.id;
    this.text = element.textContent;
    // element.querySelectorAll('.verz=se')
  }
}
