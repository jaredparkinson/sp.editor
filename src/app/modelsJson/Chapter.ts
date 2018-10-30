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
  public newWTagRefs: Array<Array<[string, string]>> = [];
  public ogWTagRefs: Array<Array<[string, string]>> = [];
  public tcWTagRefs: Array<Array<[string, string]>> = [];
  private hiddenParagraph = '.hidden-paragraph';
}
