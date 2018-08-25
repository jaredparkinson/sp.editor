import { Injectable } from '@angular/core';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';

@Injectable()
export class ChapterService {
  public bodyBlock: string;
  public notes: string;
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
    return doc.querySelector(selector).innerHTML;
  }
}
