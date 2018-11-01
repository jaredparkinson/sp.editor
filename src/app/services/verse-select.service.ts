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
import { StringService } from './string.service';

@Injectable({
  providedIn: 'root'
})
export class VerseSelectService {
  // wTags: ElementRef[];
  constructor(
    private chapterService: ChapterService,
    private ngZone: NgZone,
    private stringService: StringService
  ) {}
  verseSelect = false;
  parser = new DOMParser();
  verseSelected = false;
  public notes: ElementRef[] = [];
  public verses: ElementRef[] = [];

  public toggleVerseSelect() {
    this.verseSelect = !this.verseSelect;
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
  }
  public test(
    w: [string, string, string, string, string, string, string, string, string]
  ) {}
  public resetVerseSelect() {
    console.log('verse select');

    this.verseSelected = false;
    this.resetNotes();
    console.log(this.chapterService.wTags);
    this.modifyWTags((wa: [string, string, string, string, string, string]) => {
      if (wa[3].trim() !== '') {
        // wa[0] += ' verse-select-0';
        wa[0] = this.stringService.addAttribute(wa[0], 'verse-select-0');
      }

      wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-1');
      wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-2');
      wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-3');
      wa[0] = this.stringService.removeAttribute(wa[0], 'verse-select-4');
      // wa[0] = wa[0].replace(' verse-select-1', '');
      // wa[0] = wa[0].replace(' verse-select-2', '');
    });
  }

  private modifyWTags(
    callBack: (w: [string, string, string, string, string, string]) => void
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
    this.modifyWTags((wa: [string, string, string, string, string, string]) => {
      wa[0] = '';
    });

    // _.each(this.chapterService.wTags, wTag => {
    //   wTag[0] = wTag[0].replace(' verse-select-0', '');
    // });
  }

  public wTagClick(
    w: [string, string, string, string, string, string],
    verse: Verse
  ) {
    if (w[3].trim() === '') {
      return;
    }
    if (this.verseSelect) {
      if (
        this.stringService.hasAttribute(w[0], 'verse-select-1') ||
        this.stringService.hasAttribute(w[0], 'verse-select-4')
      ) {
        this.resetVerseSelect();
        this.verseSelected = false;
      } else if (this.stringService.hasAttribute(w[0], 'verse-select-2')) {
        this.resetNotes();
        const refs = w[4].split(',');
        w[0] = w[0].replace('verse-select-2', 'verse-select-3');
        this.selectNote(refs);
      } else if (this.stringService.hasAttribute(w[0], 'verse-select-3')) {
        this.resetNotes();
        const refs = w[5].split(',');
        w[0] = w[0].replace('verse-select-3', 'verse-select-4');
        this.selectNote(refs);
      } else {
        this.firstClick(w, verse);
      }
    }
  }

  private firstClick(
    w: [string, string, string, string, string, string],
    verse: Verse
  ) {
    this.resetVerseSelect();
    this.verseSelected = true;
    const ids = w[2].split('-');
    const refs = w[3].split(' ');
    console.log(refs);
    verse.wTags2.forEach(wr => {
      // console.log(wr);
      refs.forEach(ref => {
        if (wr[3].includes(ref) && !wr[0].includes(' verse-select-1')) {
          wr[0] = this.stringService.removeAttribute(wr[0], 'verse-select-0');
          wr[0] = this.stringService.addAttribute(wr[0], 'verse-select-1');
        } else if (wr[3].includes(ref) && wr[0].includes(' verse-select-1')) {
          wr[0] = this.stringService.removeAttribute(wr[0], 'verse-select-0');
          wr[0] = this.stringService.removeAttribute(wr[0], 'verse-select-1');
          wr[0] = this.stringService.addAttribute(wr[0], 'verse-select-2');
        }
      });
    });
    this.selectNote(refs);
  }

  private selectNote(refs: string[]) {
    const note = _.find(this.notes, (n: ElementRef) => {
      return (n.nativeElement as HTMLElement).id === refs[refs.length - 1];
    });
    if (note) {
      (note.nativeElement as HTMLElement).classList.add('verse-select-1');
      (note.nativeElement as HTMLElement).scrollIntoView({
        block: 'center'
      });
    }
  }
}
