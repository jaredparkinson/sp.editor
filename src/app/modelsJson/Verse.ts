import { W } from './WTag';
export class Verse {
  public id: string;
  public highlight: boolean = false;
  public wTags: W[] = [];
  public disabled: boolean = false;
  public context: boolean = false;
  public classList: string[] = [];
  public num: number;
}
