import { W } from './WTag';
import { W2 } from './W2';
export class Verse {
  public id: string;
  public highlight: boolean = false;
  public wTags: W[] = [];
  public text: string = '';
  public context: boolean = false;
  public num: number;
  public w2: W2[] = [];
  public classList: string[] = [];
  public disabled: boolean = false;
}
