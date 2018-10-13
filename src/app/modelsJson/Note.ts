// import * as lodash from 'lodash';

import * as lodash from 'lodash';
import * as util from 'util';
import { SecondaryNote } from './SecondaryNote';

export class Note2 {
  public id = '';
  public noteTitle = '';
  public noteShortTitle = '';
  public className = '';
  public secondaryNotes: SecondaryNote[] = [];
}
