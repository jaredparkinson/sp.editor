import { Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { Paragraph } from '../models/Paragraph';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';
import { Params } from '@angular/router';
import { faVectorSquare } from '@fortawesome/free-solid-svg-icons';

@Injectable()
export class ChapterService {
  public bodyBlock: string;
  public notes: string;
  public notesArray: HTMLElement[] = [];
  public notes2: Note[] = [];
  // public hiddenParagraphs: string[] = [];
  public paragraphs: Paragraph[] = [];
  public header: string;
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

  public getChapter(book: string, chapter: string, v: Params): void {
    const verseNums = this.parseHighlightedVerses(v);
    this.paragraphs = [];
    this.notes2 = [];
    try {
      const url2 = this.navService.urlBuilder(
        book.toLowerCase(),
        chapter.toLowerCase()
      );
      this.fs.writeFile(
        'd:/node_test.txt',
        process.env.PORTABLE_EXECUTABLE_DIR,
        e => {}
      );
      this.fs.readFile('c:/ScripturesProject/' + url2, 'utf8', (err, data) => {
        this.setChapter(data, book, chapter, verseNums);
      });
      return;
    } catch {
      console.log('Not a file system');
      const url = this.navService.getChapter(
        book.toLowerCase(),
        chapter.toLowerCase()
      );
      console.log('test web');

      url.subscribe(u => {
        this.setChapter(u, book, chapter, verseNums);
      });
    }
  }

  private setChapter(
    u: string,
    book: string,
    chapter: string,
    verseNums: number[]
  ) {
    const addressBar = document.getElementById('addressBar');
    const parser = new DOMParser();
    const doc = parser.parseFromString(u, 'text/html');
    this.bodyBlock = this.extractHtml(doc, 'div.body-block');
    const title = this.extractHtml(doc, 'h1').replace('&nbsp;', ' ');
    this.header = doc.querySelector('header').innerHTML;
    Array.prototype.slice.call(doc.querySelectorAll('note')).forEach(elem => {
      this.notes2.push(new Note(elem));
    });
    Array.prototype.slice
      .call(doc.querySelectorAll('.hidden-paragraph'))
      .forEach(elem => {
        this.paragraphs.push(new Paragraph(elem as HTMLElement, verseNums));
      });
    console.log(title);
    if (this.notes === null || this.notes === undefined) {
      this.notes = '';
    }
    const urlText = book + '/' + chapter;
    // (addressBar as HTMLInputElement).value = title;
    this.saveStateService.data.currentPage = urlText;
    this.navService.pageTitle = title;
    this.saveStateService.data.currentPage = urlText;
  }

  private parseHighlightedVerses(v: Params): number[] {
    if (v === null) {
      return [];
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
      console.log(verseNums);
    }
    return verseNums;
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
