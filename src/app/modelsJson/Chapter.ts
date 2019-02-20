import { Note } from './Note';
import { Paragraph } from './Paragraph';

export class Chapter2 {
  public _id: string = '';
  public _rev: string = '';
  public language: string = '';
  public testament: string = '';

  public title: string = '';
  public header: string;
  public notes: Note[] = [];
  public paragraphs: Paragraph[] = [];

  public bodyBlock: string = '';
  public bb: boolean = false;
  public pageUrl: string = '';

  private hiddenParagraph: string = '.hidden-paragraph';
}
