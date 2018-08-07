import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Routes } from '@angular/router';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './providers/electron.service';
import { ChapterService } from './services/chapter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faCoffee = faCoffee;
  private timer: NodeJS.Timer;
  constructor(
    public electronService: ElectronService,
    private chapterService: ChapterService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.translate.setDefaultLang('en');
    // console.log('AppConfig', AppConfig);

    // if (this.electronService.isElectron()) {
    //   console.log('Mode electron');
    //   console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
    //   console.log('NodeJS childProcess', this.electronService.childProcess);
    // } else {
    //   console.log('Mode web');
    // }
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
    // console.log(verses);
    let scrollIntoView: Element;

    if (verses === null) {
      console.log('null');
    }

    for (let x = 0; x <= verses.length; x++) {
      // console.log(verses[x]);
      const element = verses[x];
      // var asdf = function(id) {var pasdf = document.getElementById(id).getBoundingClientRect(); console.log((pasdf.top + pasdf.height >= 40 && pasdf.top < 40 +pasdf.height));}
      const top = element.getBoundingClientRect().top;
      const height = element.getBoundingClientRect().height;
      const start = 45;
      if (top + height > start && top < start + height) {
        scrollIntoView = element;
        const noteID =
          'note' + scrollIntoView.id.substring(1, scrollIntoView.id.length);
        document.getElementById(noteID).scrollIntoView();

        break;
      }
      // console.log(element);
      // console.log(
      //   element.id +
      //     ' Top: ' +
      //     element.getBoundingClientRect().top +
      //     ' Bottom: ' +
      //     element.getBoundingClientRect().bottom
      // );
    }
    // console.log('test');
  }
  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      document.getElementById('appBodyBlock').addEventListener('wheel', () => {
        this.onScroll();
      });
    });
    // this.route.params.subscribe(params => {
    //   // this.id = +params['b']; // (+) converts string 'id' to a number
    //   const book = params['book'];
    //   const chapter = params['chapter'];
    //   if (book !== undefined && chapter !== undefined) {
    //     console.log(book);
    //     console.log(chapter);
    //     this.chapterService.getChapter(book, chapter);
    //     this.route.queryParams.subscribe(v => {
    //       console.log(v['verse']);
    //     });
    //   } else if (book === undefined && chapter !== undefined) {
    //     this.chapterService.getChapter(chapter, '');
    //   }
    //   // const verse = route.queryParams['verse'];
    //   // console.log(chapter);
    //   // In a real app: dispatch action to load the details here.
    // });
  }
}
