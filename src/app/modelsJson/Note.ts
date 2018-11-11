// import * as lodash from 'lodash';

import { SecondaryNote } from './SecondaryNote';

export class Note2 {
  public id = '';
  public nT = ''; // noteTitle
  public nST = ''; // NoteShortTitle
  public cn = ''; // ClassName
  public o = false; // Override
  public v = false; // Visible
  public btn = false;
  public sn: SecondaryNote[] = [];
}
