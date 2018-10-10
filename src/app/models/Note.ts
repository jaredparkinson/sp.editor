import { DomSanitizer } from '@angular/platform-browser';

export class Note {
  public id: string;
  public button = false;
  public override = false;
  public secondaryToggled = false;
  public classList: string;
  public btnId: string;
  public innerHtml: string;
  public innerText: string;

  constructor(element: HTMLElement) {
    this.id = element.id;
    this.classList = element.classList.toString();

    this.innerHtml = element.innerHTML;
    // this.innerText = element.innerText;
    // console.log('inner' + this.innerHtml);

    this.button = element.classList.contains('a2086');
    this.btnId = 'note-button-note' + element.id.replace('note', '');
  }
  public reset(secondaryStatus: boolean): void {
    // console.log('reseting');

    this.override = false;
    this.secondaryToggled = secondaryStatus;
  }

  public secondaryButtonClick(): void {
    this.override = true;
    this.secondaryToggled = !this.secondaryToggled;
  }
}
