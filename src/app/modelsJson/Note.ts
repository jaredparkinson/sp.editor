// import * as lodash from 'lodash';

import { SecondaryNote } from './SecondaryNote';

export class Note {
  public id: string = '';
  public noteTitle: string = ''; // noteTitle
  public noteShortTitle: string = ''; // NoteShortTitle
  public classList: string = ''; // ClassName
  public override: boolean = false; // Override
  public visible: boolean = false; // Visible
  public plusbutton: boolean = false;
  public secondaryNotes: SecondaryNote[] = [];
}

export class NotePhrase {
  public classList: string[] = [];
  public superscripts: string;
  public text: string;
  public visible: boolean = true;
}
export class NoteRef {
  public id: string;
  public classList: string[] = [];
  public superscripts: string[] = [];
  public visible: boolean = true;
}
