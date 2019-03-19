import { Note } from './Note';
import { Paragraph } from './Paragraph';
import { Verse } from './Verse';

export class Chapter2 {
  public header2: Verse;
  public _id = '';
  public language = '';
  public testament = '';

  public title = '';
  public header = '';
  public shortTitle = '';
  // public oldNotes: OldNote[] = [];
  public notes: Note[] = [];
  public verses: Verse[] = [];
  public _rev = '';
  public paragraphs: Paragraph[] = [];

  public previousPage = '';
  public nextPage = '';
  public _deleted = false;
}
