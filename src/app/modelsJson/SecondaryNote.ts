import { NotePhrase } from './NotePhrase';
import { NoteRef } from './NoteRef';
export class SecondaryNote {
  public id: string;
  public classList: string[] = [];
  public notePhrase: NotePhrase;
  public noteRefs: NoteRef[] = [];
  public noteMarker: string;
  public verseMarker: string;
  public isTier2: boolean = undefined;
  public visible = true;
  public clicked = false;
}
