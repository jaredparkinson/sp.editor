import { Injectable } from '@angular/core';
import { NavigationService } from './navigation.service';
import { SaveStateService } from './save-state.service';
@Injectable()
export class ChapterService {
  public bodyBlock: string;
  public notes: string;
  constructor(
    private navService: NavigationService,
    private saveStateService: SaveStateService
  ) {}

  public getChapter(book: string, chapter: string): void {
    const url = this.navService.getChapter(
      book.toLowerCase(),
      chapter.toLowerCase()
    );

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
      (addressBar as HTMLInputElement).value = title;
      this.saveStateService.data.currentPage = urlText;
    });
  }

  private extractHtml(doc: Document, selector: string): string {
    return doc.querySelector(selector).innerHTML;
  }
}
