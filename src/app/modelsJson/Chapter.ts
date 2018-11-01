import { Note2 } from './Note';
import { Paragraph } from './Paragraph';

export class Chapter2 {
  public pageUrl = '';

  public title = '';
  public header: string;
  public notes: Note2[] = [];
  public paragraphs: Paragraph[] = [];

  public bodyBlock = '';
  public bb = false;
  // public newWTagRefs: [string, string, string, string][][] = [];
  // public ogWTagRefs: [string, string, string, string][][] = [];
  // public tcWTagRefs: [string, string, string, string][][] = [];
  private hiddenParagraph = '.hidden-paragraph';
}
