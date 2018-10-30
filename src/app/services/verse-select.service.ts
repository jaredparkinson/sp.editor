import {
  ContentChildren,
  ElementRef,
  Injectable,
  NgZone,
  QueryList,
  ViewChildren
} from '@angular/core';
import * as _ from 'lodash';
import { WTag } from '../modelsJson/WTag';
import { ChapterService } from './chapter.service';

@Injectable({
  providedIn: 'root'
})
export class VerseSelectService {
  // wTags: ElementRef[];
  constructor(private chapterService: ChapterService, private ngZone: NgZone) {}
  verseSelect = false;
  parser = new DOMParser();
  verseSelected = false;
  public notes: ElementRef[] = [];
  public verses: ElementRef[] = [];
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
    console.log(this.chapterService.wTags);

    _.each(this.chapterService.wTags, wTag => {
      const ids = wTag[2].split('-');
      // console.log(ids);
      if (
        _.find(this.chapterService.wTagRefs, wTagRef => {
          return (
            (wTagRef as HTMLElement).getAttribute('n') === ids[1] &&
            (wTagRef as HTMLElement).parentElement.id === ids[0]
          );
        })
      ) {
        if (!wTag[0].includes('verse-select-0')) {
          wTag[0] += ' verse-select-0';
        }
        wTag[0] = wTag[0].replace(' verse-select-1', '');
        wTag[0] = wTag[0].replace(' verse-select-2', '');
      }
    });
  }

  private resetNotes() {
    _.each<ElementRef>(this.notes, n => {
      (n.nativeElement as HTMLElement).classList.remove('verse-select-1');
    });
    // _.each(this.chapterService.notes2, note => {
    //   note.resetVerseSelect();
    // });
  }

  public removeVerseSelect() {
    _.each(this.chapterService.wTags, wTag => {
      wTag[0] = wTag[0].replace(' verse-select-0', '');
    });
  }

  public wTagClick(w: WTag) {
    if (this.verseSelect) {
      if (this.verseSelected === true) {
        this.resetVerseSelect();
        this.verseSelected = false;
      } else {
        this.verseSelected = true;
        const ids = w.n.split('-');
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

        const noteIndex = parseInt(ids[0].substring(1, ids[0].length), 10) - 1;

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

        const n = _.find(this.notes, note => {
          return (
            ((note as ElementRef).nativeElement as HTMLElement).id ===
            refs[refs.length - 1]
          );
        });

        if (n) {
          (n.nativeElement as HTMLElement).classList.add('verse-select-1');
          (n.nativeElement as HTMLElement).scrollIntoView({ block: 'center' });
        }

        console.log(n.nativeElement + 'n');

        _.each(this.chapterService.wTags, verse => {
          const matchedMatches = _.filter(matches, match => {
            return match[0] + '-' + match[1] === verse[2];
          });

          // console.log(matchedMatches + ' matches matches');
          // this.resetVerseSelect();

          // const doc = parser.parseFromString(verse.innerHtml, 'text/html');

          // _.each(doc.querySelectorAll('w'), wTag => {
          //   if (wTag.className.includes('verse-select')) {
          //     wTag.className = 'verse-select-0';
          //   }
          // });

          if (matchedMatches.length > 0) {
            console.log('matches' + matchedMatches);

            _.each(matchedMatches, m => {
              const underline = m[2] > 1 ? 'verse-select-1' : 'verse-select-2';
              const wTag = _.find(this.chapterService.wTags, t => {
                return t[2] === m[0] + '-' + m[1];
              });
              console.log(wTag);

              wTag[0] += underline;
              wTag[0] = wTag[0].replace('verse-select-0', '');
              // if (wTag.nextElementSibling) {
              //   console.log(
              //     'next ' + (wTag.nextElementSibling as HTMLElement).innerText
              //   );
              // }
            });
          }
        });
      }
    }
  }
}
