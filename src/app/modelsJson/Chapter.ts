import { Note2 } from './Note';
import { Paragraph } from './Paragraph';

export class Chapter2 {
  public pageUrl = '';
  public bodyBlock = '';
  public header = '';
  public notes: Note2[] = [];
  public paragraphs: Paragraph[] = [];
  private hiddenParagraph = '.hidden-paragraph';
}
