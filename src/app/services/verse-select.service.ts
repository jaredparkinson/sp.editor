import { Injectable, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { ChapterService } from './chapter.service';

@Injectable({
  providedIn: 'root'
})
export class VerseSelectService {
  verseSelect = false;
  parser = new DOMParser();
  verseSelected = false;
  constructor(private chapterService: ChapterService, private ngZone: NgZone) {}

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
          break;
        }
      }
    });
  }

  public resetVerseSelect() {
    this.verseSelected = false;
    _.each(this.chapterService.paragraphs, paragraph => {
      _.each(paragraph.verses, verse => {
        const doc = this.parser.parseFromString(verse.innerHtml, 'text/html');
        _.each(doc.querySelectorAll('w'), w => {
          const ids = w.getAttribute('n').split('-');
          w.className = '';
          if (
            _.find(this.chapterService.wTagRefs, wTagRef => {
              return (
                (wTagRef as HTMLElement).getAttribute('n') === ids[1] &&
                (wTagRef as HTMLElement).parentElement.id === ids[0]
              );
            })
          ) {
            w.classList.add('verse-select-0');
          }
        });

        verse.innerHtml = doc.querySelector('body').innerHTML;
      });
    });
  }

  public removeVerseSelect() {
    const parser = new DOMParser();
    _.each(this.chapterService.paragraphs, paragraph => {
      _.each(paragraph.verses, verse => {
        const doc = parser.parseFromString(verse.innerHtml, 'text/html');
        _.each(doc.querySelectorAll('w'), w => {
          w.className = '';
        });

        verse.innerHtml = doc.querySelector('body').innerHTML;
      });
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
        const matches: Array<[string, string, number]> = [];

        _.each(this.chapterService.wTagRefs, wTagRef => {
          const refs2 = wTagRef.getAttribute('ref').split(',');
          if (_.intersection(refs, refs2).length > 0) {
            matches.push([
              wTagRef.parentElement.id,
              wTagRef.getAttribute('n'),
              _.intersection(refs, refs2).length
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
                // console.log(wTag.nextElementSibling);
              });

              verse.innerHtml = doc.querySelector('body').innerHTML;
            }
          });
        });
      }
    }
  }
}
