export class Note {
  public id: string;
  public button = false;
  public override = false;
  public classList: string;
  public btnId: string;
  public innerHtml: string;

  constructor(element: HTMLElement) {
    this.id = element.id;
    this.classList = element.classList.toString();
    this.innerHtml = element.innerHTML;
    console.log(this.innerHtml);

    this.button = this.innerHtml.includes('+');
    this.btnId = 'note-button-note' + element.id.replace('note', '');
  }
}
