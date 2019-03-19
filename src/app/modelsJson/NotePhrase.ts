export class NotePhrase {
  public id: string;
  public classList: string[] = [];
  public text: string;
  constructor(element: Element) {
    this.id = element.id;
    this.classList = element.className ? element.className.split(' ') : [];
    this.text = element.textContent;
  }
}
