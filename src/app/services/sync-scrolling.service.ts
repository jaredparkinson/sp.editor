import { Injectable } from '@angular/core';

@Injectable()
export class SyncScrollingService {
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

    if (verses) {
      if (verses[0].getBoundingClientRect().top > 34) {
        this.scrollNotesTop();
      } else {
        let belowTop: Element[] = [];
        verses.forEach(verse => {
          if (verse.getBoundingClientRect().top > 34) {
            // console.log(verse);

            belowTop.push(verse);
          }
        });

        if (belowTop.length > 0) {
          this.scrollIntoView(belowTop);
        } else {
          this.scrollNotesBottom();
        }
      }
    }
  }
  scrollIntoView(belowTop: Element[]): void {
    document
      .querySelector(`#${belowTop[0].id.replace('p', 'note')}`)
      .scrollIntoView();
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
