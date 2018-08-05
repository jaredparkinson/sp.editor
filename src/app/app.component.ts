import { Component, OnInit } from '@angular/core';
import { Routes, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
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
  constructor(
    public electronService: ElectronService,
    private chapterService: ChapterService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
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
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // this.id = +params['b']; // (+) converts string 'id' to a number
      const book = params['book'];
      const chapter = params['chapter'];
      if (book !== undefined || chapter !== undefined) {
        console.log(book);
        console.log(chapter);
        this.route.queryParams.subscribe(v => {
          this.chapterService.getChapter(book, chapter);
          console.log(v['verse']);
        });
      }
      // const verse = route.queryParams['verse'];

      // console.log(chapter);

      // In a real app: dispatch action to load the details here.
    });
  }
}
