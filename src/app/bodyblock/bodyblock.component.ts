import { HttpClient } from '@angular/common/http';
import {
  Component,
  NgZone,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
  AfterViewChecked
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { TSQuery } from '../TSQuery';
import { log } from 'util';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss']
})
export class BodyblockComponent implements OnInit, AfterViewInit {
  private timer: NodeJS.Timer;
  private timer2: NodeJS.Timer;
  private tsQuery: TSQuery = new TSQuery();
  constructor(
    public fileManager: NavigationService,
    public httpClient: HttpClient,
    // public activatedRoute: ActivatedRoute,
    public chapterService: ChapterService,
    public navService: NavigationService,
    public saveState: SaveStateService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {}

  getBodyBlock(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.chapterService.bodyBlock
    );
    // return this.chapterService.bodyBlock;
  }
  ngOnInit() {
    this.initSyncScrolling();
    this.route.params.subscribe(params => {
      // console.log(params);

      // this.id = +params['b']; // (+) converts string 'id' to a number
      const book = params['book'];
      const chapter = params['chapter'];
      if (book !== undefined && chapter !== undefined) {
        // console.log(book);
        // console.log(chapter);
        this.chapterService.getChapter(book, chapter);
      } else if (book === undefined && chapter !== undefined) {
        this.chapterService.getChapter(chapter, '');
      }
      setTimeout(() => {
        this.route.queryParams.subscribe(v => {
          if (v['verse'] !== undefined) {
            const verseParam = (v['verse'] as string).split(',')[0];
            const verse = document.getElementById('p' + verseParam);
            if (verse !== null) {
              verse.scrollIntoView();
              document.getElementById('note' + verseParam).scrollIntoView();

              // console.log('verse: ' + v['verse']);
            }
          }
        });
      }, 600);
    });

    // this.ngZone.runOutsideAngular(() => {
    //   document.getElementById('bodyBlock').addEventListener('wheel', () => {
    //     console.log('test');
    //   });
    // });
  }
  ngAfterViewInit() {
    // asdf.scrollIntoView();
    // this.route.queryParams.subscribe(qp => {
    //   const verse = qp['verse'];
    //   const asdf = document.getElementById('p' + verse);
    //   console.log('asdf ' + asdf);
    //   asdf.scrollIntoView();
    // });
  }
  onScroll() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.synchronizedScrolling();
    }, 50);
    this.timer2 = setTimeout(() => {
      this.synchronizedScrolling();
    }, 1000);
    // this.ngZone.runOutsideAngular();
  }

  synchronizedScrolling(): void {
    const verses = document.querySelectorAll('span.verse');
    let scrollIntoView: Element;

    for (let x = 0; x < verses.length; x++) {
      const element = verses[x];
      const top = element.getBoundingClientRect().top;
      const height = element.getBoundingClientRect().height;
      const start = 35;
      if (top + height > start && top < start + height) {
        scrollIntoView = element;
      } else if (scrollIntoView !== undefined) {
        const noteID =
          'note' + scrollIntoView.id.substring(1, scrollIntoView.id.length);
        document.getElementById(noteID).scrollIntoView();

        break;
      }
    }
    if (scrollIntoView === undefined) {
      const element = verses[0];

      const top = element.getBoundingClientRect().top;
      const height = element.getBoundingClientRect().height;
      const start = 35;
      if (top + height < start) {
        document.getElementById('note_title_number1').scrollIntoView();
        console.log('test gojbvhgv');
      }
    }
  }

  private initSyncScrolling() {
    this.ngZone.runOutsideAngular(() => {
      document.getElementById('appBodyBlock').addEventListener('wheel', () => {
        this.onScroll();
      });
      document
        .getElementById('appBodyBlock')
        .addEventListener('touchend', () => {
          this.onScroll();
        });
    });
  }
}
