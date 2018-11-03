import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import { Observable } from 'rxjs';

import { DomSanitizer } from '@angular/platform-browser';
import * as localForage from 'localforage';
import * as _ from 'lodash';
import { Note } from '../models/Note';
import { Paragraph } from '../models/Paragraph';
import { Chapter2 } from '../modelsJson/Chapter';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';

@Injectable()
export class ChapterService {
  // public bodyBlock: string;
  // public notes: string;
  // public notesArray: HTMLElement[] = [];
  public notes2: Note[] = [];

  // public paragraphs: Paragraph[] = [];
  // public header: string;
  public verseNums: number[] = [];
  public contextNums: number[] = [];
  // public pageUrl = '';
  private fs: any;
  // scripturesArchive: Observable<ArrayBuffer>;
  // hebWTags: Document;
  // wTagRefs: NodeListOf<Element>;
  // verseSelect = false;
  chapter2: Chapter2 = new Chapter2();
  // wTags: Array<[string, string, string]> = [];
  scrollIntoView: Element;

  constructor(
    private navService: NavigationService,
    private httpClient: HttpClient
  ) {
    this.fs = (window as any).fs;
  }

  public resetNotes(): void {
    _.each(this.chapter2.notes, note => {
      note.o = false;
    });
  }

  public async getChapter(
    book: string,
    chapter: string,
    synchronizedScrolling: () => Promise<void>
  ): Promise<void> {
    return new Promise<void>(resolve => {
      // this.paragraphs = [];
      this.notes2 = [];
      this.navService.pageTitle = '';
      // this.header = '';
      let vSplit = chapter.split('.');
      // this.hebWTags = new Document();
      if (chapter === '') {
        vSplit = book.split('.');
      }

      this.verseNums = this.parseHighlightedVerses2(vSplit[1]);
      this.contextNums = this.parseHighlightedVerses2(vSplit[2]);
      // console.log(this.verseNums + ' ' + this.contextNums);

      console.log(this.fs);

      if (this.fs) {
        this.getChapterFS(book, vSplit, synchronizedScrolling);
      } else {
        this.getChapterWeb(book, vSplit, synchronizedScrolling);
      }
      resolve();
    });
  }

  private async verseFocus(): Promise<void> {
    setTimeout(() => {
      if (this.verseNums.length === 0) {
        document.getElementById('bodyBlockTop').scrollIntoView();
      } else {
        const focusVerse = this.contextNums
          .concat(this.verseNums)
          .sort((a, b) => {
            return a - b;
          })[0]
          .toString();
        document.getElementById('p' + focusVerse).scrollIntoView();
      }
    });
  }

  private async setHighlighting(): Promise<void> {
    _.forEach(this.chapter2.paragraphs, paragraph => {
      _.forEach(paragraph.verses, verse => {
        if (this.verseNums.includes(parseInt(verse.id.split('p')[1], 10))) {
          verse.highlight = true;
        }
        if (this.contextNums.includes(parseInt(verse.id.split('p')[1], 10))) {
          verse.context = true;
        }
      });
    });
  }

  private getChapterFS(
    book: string,
    vSplit: string[],
    synchronizedScrolling: () => Promise<void>
  ) {
    const url2 =
      this.navService.urlBuilder(book.toLowerCase(), vSplit[0].toLowerCase()) +
      '.json';
    console.log(url2 + ' url2');

    this.fs.readFile('c:/ScripturesProject/' + url2, 'utf8', (err, data) => {
      this.setChapter(data);
    });
  }

  private async getChapterWeb(
    book: string,
    vSplit: string[],
    synchronizedScrolling: () => Promise<void>
  ) {
    const saved = await localForage.getItem(book + '\\' + vSplit[0]);

    if (saved) {
      console.log('asved');

      this.setChapter(saved as string);
    } else {
      const url2 =
        'assets/' + this.navService.urlBuilder(book, vSplit[0]) + '.json';

      this.httpClient
        .get(url2, {
          observe: 'body',
          responseType: 'text'
        })
        .subscribe(data => {
          this.setChapter(data);
        });
    }
  }

  private async setChapter(data: string) {
    this.chapter2 = (await JSON.parse(data)) as Chapter2;

    await this.setHighlighting();

    console.log('verse focus');

    await this.verseFocus();
  }

  public parseHighlightedVerses2(v: string): number[] {
    // console.log('parseHighlightedVerses2');

    if (v === null || v === undefined) {
      return [];
    }
    const verseNums: number[] = [];
    if (v !== undefined) {
      const verseParams = v.split(',');

      _.forEach(verseParams, verseParam => {
        const t = verseParam.split('-');
        const count = t.length > 1 ? 1 : 0;
        for (let x = parseInt(t[0], 10); x <= parseInt(t[count], 10); x++) {
          verseNums.push(x);
        }
      });
    }

    return verseNums;
  }
}
