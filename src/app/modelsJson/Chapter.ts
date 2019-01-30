import { Note } from './Note';
import { Paragraph } from './Paragraph';

export class Chapter2 {
  public pageUrl: string = '';

  public title: string = '';
  public header: string;
  public notes: Note[] = [];
  public paragraphs: Paragraph[] = [];

  public bodyBlock: string = '';
  public bb: boolean = false;
  public noteVisibility: [string, boolean][] = [];

  private hiddenParagraph: string = '.hidden-paragraph';
}
