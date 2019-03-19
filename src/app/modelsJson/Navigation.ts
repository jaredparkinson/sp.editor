// export class Paragraphs {
//   public paragraphs: Paragraph[] = [];
// }
export class Navigation {
  public title: string;
  public shortTitle: string;
  public url: string;
  public _id: string = undefined;
  public navigation: Navigation[] = [];
  public visible = false;
  public hide = false;
  public focus = false;
}
