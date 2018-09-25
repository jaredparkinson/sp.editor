import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { faVectorSquare } from '@fortawesome/free-solid-svg-icons';
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

  constructor(
    private navService: NavigationService,
    private saveStateService: SaveStateService
  ) {
    this.fs = (window as any).fs;
  }

  public resetNotes(): void {
    this.notes2.forEach(note => {
      note.reset();
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
    let vSplit = chapter.split('.');
    if (chapter === '') {
      vSplit = book.split('.');
      // vSplit.push('');
    }
    // this.notes2.length = 0;
    console.log('vsplit 2 ' + vSplit[2]);

    try {
      // throw SyntaxError;
      console.log(this.fs);

      if (this.fs) {
        console.log('tasdfsdfasdufjin oiasdfoijasdflkasdfljk');

        throw new Error('asdf');
      }
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
    this.paragraphs.forEach(p => {
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
    Array.prototype.slice.call(doc.querySelectorAll('note')).forEach(elem => {
      this.notes2.push(new Note(elem));
    });
    Array.prototype.slice
      .call(doc.querySelectorAll('.hidden-paragraph'))
      .forEach(elem => {
        this.paragraphs.push(
          new Paragraph(elem as HTMLElement, this.verseNums, this.contextNums)
        );
      });
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
    if (v === null || v === undefined) {
      return [];
    }
    const verseNums: number[] = [];
    if (v !== undefined) {
      const verseParams = v.split(',');
      verseParams.forEach(verseParam => {
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
  public parseHighlightedVerses(v: Params): void {
    if (v === null) {
      return;
    }

    const verseNums: number[] = [];
    if (v['verse'] !== undefined) {
      const verseParams = (v['verse'] as string).split(',');
      verseParams.forEach(verseParam => {
        console.log(verseParam);

        const t = verseParam.split('-');
        const count = t.length > 1 ? 1 : 0;
        for (let x = parseInt(t[0], 10); x <= parseInt(t[count], 10); x++) {
          verseNums.push(x);
          // console.log(x);
        }
      });
      // console.log(verseNums);
    }

    console.log('333');
    this.setHighlight(verseNums);
    // return verseNums;
  }
  private setHighlight(verseNums: number[]): void {
    this.paragraphs.forEach(p => {
      console.log(p);

      p.setHighlight(verseNums);
    });
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
