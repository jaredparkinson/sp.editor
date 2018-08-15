import { Component, NgZone, OnInit } from '@angular/core';
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
  ngOnInit(): void {
    this.initNoteSettingsToggle();
  }

  private initNoteSettingsToggle() {
    document.body.addEventListener('click', e => {
      if ((e.target as HTMLElement).closest('.notes-settings') === null) {
        this.navService.notesSettings = false;
      }
      // console.log(
      //   (e.target as HTMLElement) ===
      //     document.querySelector('#btnNotesFlyout path')
      // );
      // if (
      //   !(e.target as HTMLElement).classList.contains('notes-settings') &&
      //   !(
      //     (e.target as HTMLElement) ===
      //     document.querySelector('#btnNotesFlyout path')
      //   )
      // ) {
      //   this.navService.notesSettings = false;
      //   console.log(this.navService.notesSettings);
      // }
    });
    this.ngZone.runOutsideAngular(() => {});
  }
}
