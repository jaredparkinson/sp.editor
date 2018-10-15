import {
  ContentChildren,
  ElementRef,
  Injectable,
  NgZone,
  QueryList,
  ViewChildren
} from '@angular/core';
import * as _ from 'lodash';
import { ChapterService } from './chapter.service';

@Injectable({
  providedIn: 'root'
})
export class VerseSelectService {
  wTags: ElementRef[];
  constructor(private chapterService: ChapterService, private ngZone: NgZone) {}
  verseSelect = false;
  parser = new DOMParser();
  verseSelected = false;
  @ContentChildren('notes')
  notes: ElementRef[];
  public verses: ElementRef[];
  test(): void {
    console.log(
      (_.find<ElementRef>(this.notes, n => n.nativeElement.id === 'note1')
        .nativeElement as HTMLElement)
        .querySelector('.note-phrase')
        .classList.add('verse-select-1')
    );
  }

  public toggleVerseSelect() {
    this.verseSelect = !this.verseSelect;
    this.ngZone.run(() => {
      switch (this.verseSelect) {
        case true: {
          this.resetVerseSelect();

          break;
        }
        case false:
        default: {
          this.removeVerseSelect();

          this.resetNotes();
          break;
        }
      }
    });
  }

  public resetVerseSelect() {
    this.verseSelected = false;
    this.resetNotes();
    _.each(this.chapterService.wTags, wTag => {
      const ids = wTag.n.split('-');
      // console.log(ids);
      if (
        _.find(this.chapterService.wTagRefs, wTagRef => {
          return (
            (wTagRef as HTMLElement).getAttribute('n') === ids[1] &&
            (wTagRef as HTMLElement).parentElement.id === ids[0]
          );
        })
      ) {
        wTag.className += ' verse-select-0';
      }
    });
    // console.log(this.wTags);
    // _.each(this.wTags, wTag => {
    //   const element = wTag.nativeElement as HTMLElement;
    //   const ids = element.getAttribute('n').split('-');
    //   element.className = '';
    //   if (
    //     _.find(this.chapterService.wTagRefs, wTagRef => {
    //       return (
    //         (wTagRef as HTMLElement).getAttribute('n') === ids[1] &&
    //         (wTagRef as HTMLElement).parentElement.id === ids[0]
    //       );
    //     })
    //   ) {
    //     element.classList.add('verse-select-0');
    //   }
    // });
    // _.each(this.chapterService.paragraphs, paragraph => {
    //   _.each(paragraph.verses, verse => {
    //     const doc = this.parser.parseFromString(verse.innerHtml, 'text/html');
    //     _.each(doc.querySelectorAll('w'), w => {
    //       const ids = w.getAttribute('n').split('-');
    //       w.className = '';
    //       if (
    //         _.find(this.chapterService.wTagRefs, wTagRef => {
    //           return (
    //             (wTagRef as HTMLElement).getAttribute('n') === ids[1] &&
    //             (wTagRef as HTMLElement).parentElement.id === ids[0]
    //           );
    //         })
    //       ) {
    //         w.classList.add('verse-select-0');
    //       }
    //     });

    //     this.ngZone.run(() => {
    //       verse.innerHtml = doc.querySelector('body').innerHTML;
    //     });
    //   });
    // });
  }

  private resetNotes() {
    _.each<ElementRef>(this.notes, n => {
      const verseSelect = (n.nativeElement as HTMLElement).querySelectorAll(
        '.verse-select-1'
      );
      _.each(verseSelect, vs => {
        vs.classList.remove('verse-select-1');
      });
    });
    // _.each(this.chapterService.notes2, note => {
    //   note.resetVerseSelect();
    // });
  }

  public removeVerseSelect() {
    _.each(this.chapterService.wTags, wTag => {
      wTag.className = wTag.className.replace(' verse-select-0', '');
    });
  }

  public wTagClick(event: Event) {
    if (this.verseSelect) {
      if (this.verseSelected === true) {
        this.resetVerseSelect();
        this.verseSelected = false;
      } else {
        this.verseSelected = true;
        const ids = (event.target as HTMLUnknownElement)
          .getAttribute('n')
          .split('-');
        const targetWTags = _.find(this.chapterService.wTagRefs, wTagRef => {
          return (
            (wTagRef as HTMLElement).getAttribute('n') === ids[1] &&
            (wTagRef as HTMLElement).parentElement.id === ids[0]
          );
        });
        const refs = (targetWTags as HTMLUnknownElement)
          .getAttribute('ref')
          .split(',');

        // this.chapterService.notes2[
        //   parseInt(ids[0].substring(ids[0].length - 1), 10) - 1
        // ].verseSelect(refs);

        console.log();
        const noteIndex = parseInt(ids[0].substring(1, ids[0].length), 10) - 1;

        console.log(
          (this.notes[noteIndex].nativeElement as HTMLElement)
            .querySelector('div[id="' + refs[refs.length - 1] + '"]')
            .classList.add('verse-select-1')
        );

        const matches: Array<[string, string, number]> = [];

        _.each(this.chapterService.wTagRefs, wTagRef => {
          const refs2 = wTagRef.getAttribute('ref').split(',');
          if (_.intersection(refs, refs2).length > 0) {
            matches.push([
              wTagRef.parentElement.id,
              wTagRef.getAttribute('n'),
              refs2.length
            ]);
          }
        });

        const parser = new DOMParser();

        _.each(this.chapterService.paragraphs, paragraph => {
          _.each(paragraph.verses, verse => {
            const matchedMatches = _.filter(matches, match => {
              return match[0] === verse.id;
            });
            const doc = parser.parseFromString(verse.innerHtml, 'text/html');

            _.each(doc.querySelectorAll('w'), wTag => {
              if (wTag.className.includes('verse-select')) {
                wTag.className = 'verse-select-0';
              }
            });

            if (matchedMatches.length > 0) {
              _.each(matchedMatches, m => {
                const underline =
                  m[2] > 1 ? 'verse-select-1' : 'verse-select-2';
                const wTag = doc.querySelector(
                  ' w[n="' + m[0] + '-' + m[1] + '"]'
                );

                wTag.classList.add(underline);
                wTag.classList.remove('verse-select-0');
                // if (wTag.nextElementSibling) {
                //   console.log(
                //     'next ' + (wTag.nextElementSibling as HTMLElement).innerText
                //   );
                // }
              });

              this.ngZone.run(() => {
                verse.innerHtml = doc.querySelector('body').innerHTML;
              });
              // console.log(event.target);
            }
          });
        });
      }
    }
  }
}
