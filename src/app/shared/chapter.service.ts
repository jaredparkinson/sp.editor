import {
  Injectable,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { NavigationService } from '../navigation.service';
@Injectable()
export class ChapterService {
  public bodyBlock: string;
  public notes: string;
  constructor(private navService: NavigationService) {}

  //   ngOnChanges(changes: SimpleChanges) {
  //     console.log('test');
  //   }

  public getChapter(book: string, chapter: string): void {
    const url = this.navService.getChapter(book, chapter);
    url.subscribe(u => {
      const cheerio = require('cheerio');
      // console.log(u);
      const $ = cheerio.load(u);

      this.bodyBlock = this.extractHtml($, 'div.body-block');
      this.notes = this.extractHtml($, 'footer.study-notes');
    });
    console.log(this.notes);
  }

  private extractHtml($: any, selector: string): string {
    return $(selector).html();
  }
}
