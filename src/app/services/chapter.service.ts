import { Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';

@Injectable()
export class ChapterService {
  public bodyBlock: string;
  public notes: string;
  public notesArray: HTMLElement[] = [];
  public notes2: Note[] = [];
  private fs: any;
  constructor(
    private navService: NavigationService,
    private saveStateService: SaveStateService
  ) {
    this.fs = (window as any).fs;
  }

  public getChapter(book: string, chapter: string): void {
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
        this.notes = this.extractHtml(doc, 'footer.study-notes');
        const title = this.extractHtml(doc, 'h1').replace('&nbsp;', ' ');
        console.log(title);

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
      this.notes = this.extractHtml(doc, 'footer.study-notes');
      // console.log(doc.querySelectorAll('note'));
      this.notesArray = Array.prototype.slice.call(
        doc.querySelectorAll('note')
      );

      Array.prototype.slice.call(doc.querySelectorAll('note')).forEach(elem => {
        this.notes2.push(elem);
      });
      this.notes2.forEach(n => {
        console.log(n.button);
      });
      // console.log('Notes2 ' + this.notes2);

      // this.notesArray[0].classList.contains
      // this.notesArray.forEach(element => {
      //   if (element.innerHTML.includes('button')) {
      //     console.log(element);
      //   }
      //   // console.log(element as HTMLElement);
      // });
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
