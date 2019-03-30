import { Note } from './Note';
import { Paragraph } from './Paragraph';
import { Verse } from './Verse';

export class Chapter2 {
  public _deleted = false;
  public _id = '';
  public _rev = '';
  public dataAid: string = '';
  public header = '';
  public header2: Verse;
  public language = '';
  public nextPage = '';
  // public oldNotes: OldNote[] = [];
  public notes: Note[] = [];
  public paragraphs: Paragraph[] = [];

  public previousPage = '';
  public shortTitle = '';
  public testament = '';

  public title = '';
  public verses: Verse[] = [];
}
