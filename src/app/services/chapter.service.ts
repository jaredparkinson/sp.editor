import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { faVectorSquare } from '@fortawesome/free-solid-svg-icons';
import * as jsZip from 'jszip';
// import * as pako from 'pako';
import { Observable } from 'rxjs';

import * as _ from 'lodash';
import { Note } from '../models/Note';
import { Paragraph } from '../models/Paragraph';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';
import { SyncScrollingService } from './sync-scrolling.service';

@Injectable()
export class ChapterService {
  public bodyBlock: string;
  public notes: string;
  public notesArray: HTMLElement[] = [];
  public notes2: Note[] = [];
  // public hiddenParagraphs: string[] = [];
  public paragraphs: Paragraph[] = [];
  public header: string;
  public verseNums: number[] = [];
  public contextNums: number[] = [];
  public pageUrl = '';
  private fs: any;
  scripturesArchive: Observable<ArrayBuffer>;

  constructor(
    private navService: NavigationService,
    private saveStateService: SaveStateService,
    private httpClient: HttpClient
  ) {
    this.fs = (window as any).fs;
    // if (!this.fs || this.fs === undefined) {
    //   this.scripturesArchive = this.httpClient.get('assets/scriptures.zip', {
    //     observe: 'body',
    //     responseType: 'arraybuffer'
    //   });
    // }
  }

  public resetNotes(): void {
    _.each(this.notes2, note => {
      note.reset(this.saveStateService.data.secondaryNotesVisible);
    });
  }

  public getChapter(
    book: string,
    chapter: string,
    synchronizedScrolling: () => void
  ): void {
    // const verseNums = this.parseHighlightedVerses(v);
    this.paragraphs = [];
    this.notes2 = []; // chapter.split('.');
    this.navService.pageTitle = '';
    this.header = '';
    let vSplit = chapter.split('.');
    if (chapter === '') {
      vSplit = book.split('.');
      // vSplit.push('');
    }
    // this.notes2.length = 0;
    console.log('vsplit 2 ' + vSplit[2]);

    try {
      // throw SyntaxError;
      // console.log(this.fs);

      // if (this.fs) {
      //   console.log('tasdfsdfasdufjin oiasdfoijasdflkasdfljk');

      //   throw new Error('asdf');
      // }?
      const url2 = this.navService.urlBuilder(
        book.toLowerCase(),
        vSplit[0].toLowerCase()
      );
      this.fs.writeFile(
        'd:/node_test.txt',
        process.env.PORTABLE_EXECUTABLE_DIR,
        e => {}
      );
      this.fs.readFile('c:/ScripturesProject/' + url2, 'utf8', (err, data) => {
        this.setChapter(
          data,
          book,
          vSplit[0],
          vSplit[1],
          vSplit[2],
          synchronizedScrolling
        );
      });
      return;
    } catch {
      console.log('Not a file system');
      const url = this.navService.getChapter(
        book.toLowerCase(),
        vSplit[0].toLowerCase()
      );
      console.log('test web');

      // this.scripturesArchive.subscribe(data => {
      //   // const results = pako.inflate(new Uint8Array(data));0
      //   jsZip.loadAsync(data).then(async o => {
      //     const f = await o
      //       .file(
      //         this.navService.urlBuilder(
      //           book.toLowerCase(),
      //           vSplit[0].toLowerCase()
      //         )
      //       )
      //       .async('text');

      //     this.setChapter(
      //       f,
      //       book,
      //       vSplit[0],
      //       vSplit[1],
      //       vSplit[2],
      //       synchronizedScrolling
      //     );
      //   });

      //   // console.log(results);
      // });
      url.subscribe(u => {
        this.setChapter(
          u,
          book,
          vSplit[0],
          vSplit[1],
          vSplit[2],
          synchronizedScrolling
        );
      });
    }
  }
  public resetHighlighting(): void {
    _.forEach(this.paragraphs, p => {
      p.resetHighlight();
    });
  }

  private setChapter(
    u: string,
    book: string,
    chapter: string,
    highlight: string,
    context: string,
    synchronizedScrolling: () => void
  ) {
    this.verseNums = this.parseHighlightedVerses2(highlight);
    this.contextNums = this.parseHighlightedVerses2(context);
    // console.log(' Context Nums ' + contextNums.length + ' ' + context);

    const addressBar = document.getElementById('addressBar');
    const parser = new DOMParser();
    const doc = parser.parseFromString(u, 'text/html');
    this.pageUrl = doc
      .querySelector('meta.page-url')
      .attributes.getNamedItem('content').value;
    console.log(this.pageUrl);

    this.bodyBlock = this.extractHtml(doc, 'div.body-block');
    const title = this.extractHtml(doc, 'h1').replace('&nbsp;', ' ');
    const urlText = book + '/' + chapter;

    this.saveStateService.data.currentPage = urlText;
    this.navService.pageTitle = title;
    this.saveStateService.data.currentPage = urlText;

    this.header = doc.querySelector('header').innerHTML;
    _.each(doc.querySelectorAll('note'), elem => {
      this.notes2.push(new Note(elem as HTMLElement));
    });
    let hiddenParagraph = '.hidden-paragraph';
    let tgGs = false;
    if (book === 'tg' || book === 'gs') {
      // console.log('tggs');
      hiddenParagraph = '.index ul';
      tgGs = true;
    }
    console.log(doc.querySelectorAll(hiddenParagraph));

    _.each(doc.querySelectorAll(hiddenParagraph), elem => {
      this.paragraphs.push(
        new Paragraph(
          elem as HTMLElement,
          this.verseNums,
          this.contextNums,
          tgGs
        )
      );
    });
    // Array.prototype.slice
    //   .call(doc.querySelectorAll('.hidden-paragraph'))
    //   .forEach(elem => {
    //     this.paragraphs.push(
    //       new Paragraph(elem as HTMLElement, this.verseNums, this.contextNums)
    //     );
    //   });
    if (this.notes === null || this.notes === undefined) {
      this.notes = '';
    }
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
        // console.log('gghvtucydxydx' + focusVerse);

        document.getElementById('p' + focusVerse).scrollIntoView();
      }
      synchronizedScrolling();
      // this.syncScrolling.synchronizedScrolling();

      // console.log();
    }, 0);
  }

  public parseHighlightedVerses2(v: string): number[] {
    console.log('parseHighlightedVerses2');

    if (v === null || v === undefined) {
      return [];
    }
    const verseNums: number[] = [];
    if (v !== undefined) {
      const verseParams = v.split(',');

      _.forEach(verseParams, verseParam => {
        // console.log(verseParam);

        const t = verseParam.split('-');
        const count = t.length > 1 ? 1 : 0;
        for (let x = parseInt(t[0], 10); x <= parseInt(t[count], 10); x++) {
          verseNums.push(x);
          // console.log(x);
        }
      });
    }

    return verseNums;
    // this.setHighlight(verseNums);
    // return verseNums;
  }

  private extractHtml(doc: Document, selector: string): string {
    const html = doc.querySelector(selector);
    if (html !== undefined && html !== null) {
      // console.log(html);
      return html.innerHTML;
    }
    return '';
  }
}
