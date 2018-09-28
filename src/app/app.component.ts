import { Component, NgZone, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Routes } from '@angular/router';
import {
  faChevronLeft,
  faChevronRight,
  faCoffee
} from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
// import remote from 'electron';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './providers/electron.service';
import { ChapterService } from './services/chapter.service';
import { NavigationService } from './services/navigation.service';
import { SaveStateService } from './services/save-state.service';
import { ipcRenderer } from 'electron';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faCoffee = faCoffee;
  ipcRenderer: any;

  public testStyle = '#gridBody {background-color: black;}';
  constructor(
    public electronService: ElectronService,
    private chapterService: ChapterService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    public navService: NavigationService,
    public saveState: SaveStateService,
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
    // }import searchInPage from 'electron-in-page-search';
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.electronService.isElectron()) {
      // console.log('electron service ' + this.electronService.isElectron());
      if (event.key === 'f' && event.ctrlKey) {
        this.electronService.ipcRenderer.sendSync('search-open', 'close');
      }

      if (event.key === 'Escape') {
        console.log(event);
        this.electronService.ipcRenderer.sendSync('search-close', 'close');
      }
    }
  }

  ngOnInit(): void {
    this.initNoteSettingsToggle();
  }
  gridBodyClick() {
    // console.log('body clicked');
    // this.navService.notesSettings = false;
    // if (
    //   (e.target as HTMLElement).closest('.notes-settings') === null &&
    //   this.navService.notesSettings
    // ) {
    //   console.log(e);
    //   this.navService.notesSettings = false;
    // }
  }

  private initNoteSettingsToggle() {
    // document.body
    // this.ngZone.runOutsideAngular(() => {
    //   document.querySelector('div.grid.main').addEventListener('click', e => {
    //     if ((e.target as HTMLElement).closest('.notes-settings') === null) {
    //       console.log(e);
    //       this.navService.notesSettings = false;
    //     }
    //   });
    // });
  }
}
