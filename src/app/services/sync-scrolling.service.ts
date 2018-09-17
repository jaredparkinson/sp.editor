import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class SyncScrollingService {
  constructor(private ngZone: NgZone) {}

  synchronizedScrolling(): void {
    const verses = document.querySelectorAll('span.verse');
    let scrollIntoView: Element;

    for (let x = 0; x < verses.length; x++) {
      const element = verses[x];
      const top = element.getBoundingClientRect().top;
      const height = element.getBoundingClientRect().height;
      const start = 35;
      if (top + height > start && top < start + height) {
        scrollIntoView = element;
      } else if (scrollIntoView !== undefined) {
        const noteID =
          'note' + scrollIntoView.id.substring(1, scrollIntoView.id.length);

        document.getElementById(noteID).scrollIntoView();

        break;
      }
    }

    if (scrollIntoView === undefined) {
      console.log(scrollIntoView);

      const element = verses[0];

      const top = element.getBoundingClientRect().top;
      const height = element.getBoundingClientRect().height;

      // console.log('Top: ' + top + ' height: ' + height + ' start: ' + start);

      const start = 35;
      if (top + height > start) {
        this.scrollNotesTop();
        // console.log('test gojbvhgv');
      } else {
        this.scrollNotesBottom();
      }
    }
  }

  private scrollNotesBottom() {
    const notes = document.querySelectorAll('note');
    notes[notes.length - 1].scrollIntoView();
  }

  private scrollNotesTop() {
    document.querySelector('note').scrollIntoView();
  }

  public initSyncScrolling() {
    this.ngZone.runOutsideAngular(() => {
      document.getElementById('appBodyBlock').addEventListener('wheel', () => {
        this.onScroll();
      });
      document
        .getElementById('appBodyBlock')
        .addEventListener('touchend', () => {
          this.onScroll();
        });
    });
  }
  onScroll(): any {
    throw new Error('Method not implemented.');
  }
}
