import { Injectable } from '@angular/core';
// import { setTimeout } from 'core-js';

@Injectable()
export class SyncScrollingService {
  public syncScrollingActivated = false;
  public syncScrollingAnimated = false;

  private timer: any;
  constructor() {}

  public initSyncScrolling() {
    // this.ngZone.runOutsideAngular(() => {
    //   document.getElementById('appBodyBlock').addEventListener('wheel', () => {
    //     this.onScroll();
    //   });
    //   document
    //     .getElementById('appBodyBlock')
    //     .addEventListener('touchend', () => {
    //       this.onScroll();
    //     });
    // });
  }

  public onScroll() {
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      this.synchronizedScrolling();
      // console.log(this.verses);
      // this.synchronizedScrolling();
    }, 50);
  }

  public scrollNoteIntoView(belowTop: Element[]): Promise<void> {
    return new Promise<void>(resolve => {
      const note = document.querySelector(
        `#${belowTop[0].id.replace('p', 'note')}`,
      );
      if (note) {
        setTimeout(() => {
          note.scrollIntoView();
          resolve();
        }, 300);
      } else {
        resolve();
      }
    });
  }

  public synchronizedScrolling(): void {
    const verses = document.querySelectorAll('span.verse');

    if (verses && verses.length > 0) {
      if (verses[0].getBoundingClientRect().top > 34) {
        this.scrollNotesTop();
      } else {
        const belowTop: Element[] = [];
        verses.forEach(verse => {
          if (verse.getBoundingClientRect().top > 34) {
            // console.log(verse);

            belowTop.push(verse);
          }
        });

        this.scrollIntoView(belowTop);
      }
    }
  }
  private async scrollIntoView(belowTop: Element[]) {
    this.syncScrollingActivated = true;
    this.syncScrollingAnimated = true;

    if (belowTop.length > 0) {
      await this.scrollNoteIntoView(belowTop);
    } else {
      await this.scrollNotesBottom();
    }

    this.syncScrollingActivated = false;
    this.syncScrollingAnimated = true;
    setTimeout(() => {
      this.syncScrollingActivated = false;
      this.syncScrollingAnimated = false;
    }, 300);
  }

  private scrollNotesBottom() {
    const notes = document.querySelectorAll('note');
    if (notes && notes[notes.length - 1]) {
      notes[notes.length - 1].scrollIntoView();
    }
  }

  private scrollNotesTop() {
    const note = document.querySelector('note');
    if (note) {
      document.querySelector('note').scrollIntoView();
    }
  }
}
