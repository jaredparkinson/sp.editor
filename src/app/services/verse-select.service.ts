import {
  ContentChildren,
  ElementRef,
  Injectable,
  NgZone,
  QueryList,
  ViewChildren
} from '@angular/core';
import * as _ from 'lodash';
import { Verse } from '../modelsJson/Verse';
import { WTag } from '../modelsJson/WTag';
import { ChapterService } from './chapter.service';
import { SaveStateService } from './save-state.service';
import { StringService } from './string.service';

@Injectable({
  providedIn: 'root'
})
export class VerseSelectService {
  // wTags: ElementRef[];
  constructor(
    private chapterService: ChapterService,
    private ngZone: NgZone,
    private stringService: StringService,
    private saveState: SaveStateService
  ) {}
  // verseSelect = false;
  parser = new DOMParser();
  verseSelected = false;
  public notes: ElementRef[] = [];
  public verses: ElementRef[] = [];

  public toggleVerseSelect() {
    this.saveState.data.verseSelect = !this.saveState.data.verseSelect;
    this.saveState.save();
    switch (this.saveState.data.verseSelect) {
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
  }
  public test(
    w: [string, string, string, string, string, string, string, string, string]
  ) {}
  public resetVerseSelect() {
    this.verseSelected = false;
    this.resetNotes();

    this.modifyWTags(
      (
        wa: [string, string, string, string, string, string, number, string[]]
      ) => {
        wa[7] = [];

        wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-0');

        this.createRefList(wa, this.saveState.data.newNotesVisible, 3);
        this.createRefList(wa, this.saveState.data.englishNotesVisible, 4);
        this.createRefList(wa, this.saveState.data.translatorNotesVisible, 5);
        // console.log(wa[7]);

        if (wa[7].length !== 0) {
          wa[0] = this.stringService.addAttribute(wa[0], 'verse-select-0');
          wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-1');
          wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-2');
        }
      }
    );
  }

  private createRefList(
    wa: [string, string, string, string, string, string, number, string[]],
    vis: boolean,
    noteNumber: number
  ) {
    // console.log(vis);

    if (vis) {
      (wa[noteNumber] as string).split(' ').forEach(w => {
        if (w.trim() !== '') {
          wa[7].push(w);
        }
      });
    }
  }

  private modifyWTags(
    callBack: (
      w: [string, string, string, string, string, string, number, string[]]
    ) => void
  ) {
    _.each(this.chapterService.chapter2.paragraphs, paragrah => {
      _.each(paragrah.verses, verse => {
        _.each(verse.wTags2, wa => {
          callBack(wa);
        });
      });
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
    this.modifyWTags(
      (
        wa: [string, string, string, string, string, string, number, string[]]
      ) => {
        for (let x = 0; x < 10; x++) {
          wa[0] = this.stringService.removeAttribute(
            wa[0],
            'verse-select-' + x
          );
        }
      }
    );

    // _.each(this.chapterService.wTags, wTag => {
    //   wTag[0] = wTag[0].replace(' verse-select-0', '');
    // });
  }

  public wTagClick(
    w: [string, string, string, string, string, string, number, string[]],
    verse: Verse
  ) {
    console.log(this.saveState.data.verseSelect);

    if (
      w[7].length === 0 &&
      !this.stringService.hasAttribute(w[0], 'verse-select-2') &&
      !this.stringService.hasAttribute(w[0], 'verse-select-1')
    ) {
      return;
    }
    if (this.saveState.data.verseSelect) {
      // console.log('asodifj');

      if (this.stringService.hasAttribute(w[0], 'verse-select-0')) {
        this.firstClick(w, verse);
      } else if (this.stringService.hasAttribute(w[0], 'verse-select-1')) {
        this.resetVerseSelect();
      } else if (this.stringService.hasAttribute(w[0], 'verse-select-2')) {
        console.log('asdfasdfasdfasdfasdf');
        this.resetVerseSelect1(w);
        this.selectNote(w);
      }
      // if (
      //   this.stringService.hasAttribute(w[0], 'verse-select-1') ||
      //   this.stringService.hasAttribute(w[0], 'verse-select-3')
      // ) {
      //   this.resetVerseSelect();
      //   this.verseSelected = false;
      // } else if (this.stringService.hasAttribute(w[0], 'verse-select-2')) {
      //   this.resetVerseSelect1();
      //   this.resetNotes();
      //   const refs = w[4].split(',');
      //   w[0] = w[0].replace('verse-select-2', 'verse-select-3');
      //   this.selectNote(refs);
      // } else {
      //   this.firstClick(w, verse);
      // }
      // else if (this.stringService.hasAttribute(w[0], 'verse-select-3')) {
      //   this.resetNotes();
      //   const refs = w[5].split(',');
      //   w[0] = w[0].replace('verse-select-3', 'verse-select-4');
      //   this.selectNote(refs);
      // }
    }
  }
  resetVerseSelect1(
    wTag: [string, string, string, string, string, string, number, string[]]
  ): void {
    this.modifyWTags(
      (
        wa: [string, string, string, string, string, string, number, string[]]
      ) => {
        if (wa !== wTag) {
          wa[7] = [];

          wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-0');

          this.createRefList(wa, this.saveState.data.newNotesVisible, 3);
          this.createRefList(wa, this.saveState.data.englishNotesVisible, 4);
          this.createRefList(wa, this.saveState.data.translatorNotesVisible, 5);
          // console.log(wa[7]);

          if (wa[7].length !== 0) {
            wa[0] = this.stringService.addAttribute(wa[0], 'verse-select-0');
            wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-1');
            wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-2');
          }
        }
      }
    );
    // this.modifyWTags(
    //   (
    //     wa: [string, string, string, string, string, string, number, string[]]
    //   ) => {
    //     if (wa[3].trim() !== '') {
    //       wa[0] = this.stringService.addAttribute(wa[0], 'verse-select-0');
    //       wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-1');
    //     }
    //     if (wa[4].trim() !== '') {
    //       wa[0] = this.stringService.addAttribute(wa[0], 'verse-og-select-0');
    //       wa[0] = this.stringService.removeAttribute(
    //         wa[0],
    //         'verse-og-select-1'
    //       );
    //     }
    //     if (wa[5].trim() !== '') {
    //       wa[0] = this.stringService.addAttribute(wa[0], 'verse-tc-select-0');
    //       wa[0] = this.stringService.removeAttribute(
    //         wa[0],
    //         'verse-tc-select-1'
    //       );
    //     }
    //   }
    // );
  }

  private firstClick(
    w: [string, string, string, string, string, string, number, string[]],
    verse: Verse
  ) {
    this.resetVerseSelect();
    this.verseSelected = true;
    console.log(w[7]);
    verse.wTags2.forEach(wr => {
      // console.log(wr);

      w[7].forEach(ref => {
        if (wr[3].includes(ref) && wr[7].length >= 1) {
          wr[0] = this.stringService.removeAttribute(wr[0], 'verse-select-0');
          wr[0] =
            wr[7].length > 1
              ? this.stringService.addAttribute(wr[0], 'verse-select-2')
              : this.stringService.addAttribute(wr[0], 'verse-select-1');
        }
      });
    });
    this.selectNote(w);
  }

  private refCount(refs: string): number {
    return refs.split(' ').length;
  }
  private selectNote(
    wTag: [string, string, string, string, string, string, number, string[]]
  ) {
    // console.log(wTag[7].length);
    if (wTag[7].length === 0) {
      // console.log(wTag[7]);

      this.resetVerseSelect();
      return;
    }
    const note = _.find(this.notes, (n: ElementRef) => {
      return (n.nativeElement as HTMLElement).id === wTag[7][0];
    });
    wTag[7].shift();
    // console.log('note ' + wTag[7]);

    if (note) {
      (note.nativeElement as HTMLElement).classList.add('verse-select-1');
      (note.nativeElement as HTMLElement).scrollIntoView({
        block: 'center'
      });
    } else {
      this.resetVerseSelect();
    }
  }
}
