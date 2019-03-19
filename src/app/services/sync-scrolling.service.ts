import { Injectable } from '@angular/core';

@Injectable()
export class SyncScrollingService {
  public syncScrollingAnimated = false;
  public syncScrollingActivated = false;
  constructor() {}

  private timer: NodeJS.Timer;

  public onScroll() {
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      this.synchronizedScrolling();
      // console.log(this.verses);
      // this.synchronizedScrolling();
    }, 50);
  }

  synchronizedScrolling(): void {
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

  scrollNoteIntoView(belowTop: Element[]): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        document
          .querySelector(`#${belowTop[0].id.replace('p', 'note')}`)
          .scrollIntoView();
        resolve();
      }, 300);
    });
  }

  private scrollNotesBottom() {
    const notes = document.querySelectorAll('note');
    notes[notes.length - 1].scrollIntoView();
  }

  private scrollNotesTop() {
    document.querySelector('note').scrollIntoView();
  }

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
}
