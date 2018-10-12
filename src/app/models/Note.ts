import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';
export class Note {
  public id: string;
  public button = false;
  public override = false;
  public secondaryToggled = false;
  public classList: string;
  public btnId: string;
  public innerHtml: string;
  public innerText: string;

  public h: SafeHtml;

  constructor(element: HTMLElement, sanitizer: DomSanitizer) {
    this.id = element.id;
    this.classList = element.classList.toString();

    this.innerHtml = element.innerHTML;
    // this.innerText = element.innerText;
    // console.log('inner' + this.innerHtml);
    this.h = sanitizer.bypassSecurityTrustHtml(this.innerHtml);

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

  public resetVerseSelect() {
    console.log('resetting innherml');

    this.innerHtml = this.innerHtml
      .replace('verse-select-1', '')
      .replace('verse-select-2', '');
  }

  public verseSelect(refs: string[]) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.innerHtml, 'text/html');
    console.log(refs);

    _.each(refs, (ref, i) => {
      if (refs.length > 1 && i === 0) {
        // console.log(refs);

        return;
      }
      doc
        .getElementById(ref)
        .classList.add('verse-select-' + (i > 0 ? '1' : '2'));
      console.log();
    });
    this.innerHtml = doc.querySelector('body').innerHTML;
  }
}
