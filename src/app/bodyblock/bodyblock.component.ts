import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss']
})
export class BodyblockComponent implements OnInit {
  private timer: NodeJS.Timer;
  constructor(
    public fileManager: NavigationService,
    public httpClient: HttpClient,
    // public activatedRoute: ActivatedRoute,
    public chapterService: ChapterService,
    public navService: NavigationService,
    public saveState: SaveStateService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  getBodyBlock(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.chapterService.bodyBlock
    );
    // return this.chapterService.bodyBlock;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      // this.id = +params['b']; // (+) converts string 'id' to a number
      const book = params['book'];
      const chapter = params['chapter'];
      if (book !== undefined && chapter !== undefined) {
        console.log(book);
        console.log(chapter);
        this.chapterService.getChapter(book, chapter);
        this.route.queryParams.subscribe(v => {
          console.log(v['verse']);
        });
      } else if (book === undefined && chapter !== undefined) {
        this.chapterService.getChapter(chapter, '');
      }
      // const verse = route.queryParams['verse'];

      // console.log(chapter);

      // In a real app: dispatch action to load the details here.
    });
  }

  onScroll() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.synchronizedScrolling();
    }, 50);
    // this.ngZone.runOutsideAngular();
  }

  synchronizedScrolling(): void {
    const verses = document.querySelectorAll('span.verse');
    console.log(verses);

    // for (let x = 0; x <= verses.length; x++) {
    //   const element = verses[x];
    //   console.log(
    //     'Top: ' +
    //       element.getBoundingClientRect().top +
    //       ' Bottom: ' +
    //       element.getBoundingClientRect().bottom
    //   );
    // }
    console.log('test');
  }
}
