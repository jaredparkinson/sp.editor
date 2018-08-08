import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Routes } from '@angular/router';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './providers/electron.service';
import { ChapterService } from './services/chapter.service';
import { NavigationService } from './services/navigation.service';

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
    private navService: NavigationService,
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
    let scrollIntoView: Element;

    for (let x = 0; x <= verses.length; x++) {
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
  }
  ngOnInit(): void {
    this.initSyncScrolling();
    this.initNoteSettingsToggle();
  }

  private initNoteSettingsToggle() {
    document.body.addEventListener('click', e => {
      console.log(
        (e.target as HTMLElement) ===
          document.querySelector('#btnNotesFlyout path')
      );
      if (
        !(e.target as HTMLElement).classList.contains('notes-settings') &&
        !(
          (e.target as HTMLElement) ===
          document.querySelector('#btnNotesFlyout path')
        )
      ) {
        this.navService.notesSettings = false;
        console.log(this.navService.notesSettings);
      }
    });
    this.ngZone.runOutsideAngular(() => {});
  }

  private initSyncScrolling() {
    this.ngZone.runOutsideAngular(() => {
      document.getElementById('appBodyBlock').addEventListener('wheel', () => {
        this.onScroll();
      });
      document.getElementById('appBodyBlock').addEventListener('scroll', () => {
        this.onScroll();
      });
    });
  }
}
