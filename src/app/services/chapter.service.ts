import { Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { Paragraph } from '../models/Paragraph';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';

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

  public getChapter(book: string, chapter: string): void {
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
        console.log(process.env);
        const addressBar = document.getElementById('addressBar');
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        this.bodyBlock = this.extractHtml(doc, 'div.body-block');
        const title = this.extractHtml(doc, 'h1').replace('&nbsp;', ' ');
        this.header = doc.querySelector('header').innerHTML;

        Array.prototype.slice
          .call(doc.querySelectorAll('note'))
          .forEach(elem => {
            this.notes2.push(new Note(elem));
          });

        Array.prototype.slice
          .call(doc.querySelectorAll('.hidden-paragraph'))
          .forEach(elem => {
            console.log(elem);
            this.paragraphs.push(new Paragraph(elem as HTMLElement));
          });

        if (this.notes === null || this.notes === undefined) {
          this.notes = '';
        }

        const urlText = book + '/' + chapter;
        // (addressBar as HTMLInputElement).value = title;
        this.navService.pageTitle = title;
        this.saveStateService.data.currentPage = urlText;
      });
      return;
    } catch {
      console.log('Not a file system');
    }
    const url = this.navService.getChapter(
      book.toLowerCase(),
      chapter.toLowerCase()
    );
    console.log('test web');

    url.subscribe(u => {
      const addressBar = document.getElementById('addressBar');
      const parser = new DOMParser();
      const doc = parser.parseFromString(u, 'text/html');

      this.bodyBlock = this.extractHtml(doc, 'div.body-block');
      // this.notes = this.extractHtml(doc, 'footer.study-notes');
      // console.log(doc.querySelectorAll('note'));
      // this.notesArray = Array.prototype.slice.call(
      //   doc.querySelectorAll('note')
      // );
      this.header = doc.querySelector('header').innerHTML;

      // Array.prototype.slice
      //   .call(doc.querySelectorAll('.hidden-paragraph'))
      //   .forEach(elem => {
      //     console.log(elem);
      //     this.hiddenParagraphs.push((elem as HTMLElement).innerHTML);
      //   });
      Array.prototype.slice
        .call(doc.querySelectorAll('.hidden-paragraph'))
        .forEach(elem => {
          console.log(elem);
          this.paragraphs.push(new Paragraph(elem as HTMLElement));
        });
      Array.prototype.slice.call(doc.querySelectorAll('note')).forEach(elem => {
        this.notes2.push(new Note(elem));
        // console.log((elem as HTMLElement).innerHTML.includes('button'));
      });
      const title = this.extractHtml(doc, 'h1').replace('&nbsp;', ' ');
      console.log(title);

      if (this.notes === null || this.notes === undefined) {
        this.notes = '';
      }

      const urlText = book + '/' + chapter;
      // (addressBar as HTMLInputElement).value = title;
      this.saveStateService.data.currentPage = urlText;
      this.navService.pageTitle = title;
      this.saveStateService.data.currentPage = urlText;
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
