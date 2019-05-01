import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import * as matCSS from 'materialize-css';
import { Navigation } from './modelsJson/Navigation';
import { ElectronService } from './providers/electron.service';
import { ChapterService } from './services/chapter.service';
import { DatabaseService } from './services/database.service';
import { MediaQueryService } from './services/media-query.service';
import { NavigationService } from './services/navigation.service';
import { SaveStateService } from './services/save-state.service';
// // import { VerseSelectService } from './services/verse-select.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterContentInit {
  public ipcRenderer: any;

  public testStyle = '#gridBody {background-color: black;}';
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    public chapterServices: ChapterService,
    public navService: NavigationService,
    public saveState: SaveStateService,
    // public verseSelectService: VerseSelectService,
    public httpClient: HttpClient,
    public mediaQueryService: MediaQueryService,
    public databaseService: DatabaseService,
    private swUpdate: SwUpdate,
  ) {
    this.translate.setDefaultLang('en');

    this.swUpdate.available.subscribe(evt => {
      if (!document.querySelector('.update-button')) {
        matCSS.toast({
          html: `<span class="update-button" onclick="location.reload()">Click here to update</span>`,
          displayLength: 1000000,
        });
      }
    });
    if (this.electronService.isElectron()) {
    }
    // console.log('AppConfig', AppConfig);

    // if (this.electronService.isElectron()) {
    //   console.log('Mode electron');
    //   console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
    //   console.log('NodeJS childProcess', this.electronService.childProcess);
    // } else {
    //   console.log('Mode web');
    // }import searchInPage from 'electron-in-page-search';
  }
  public gridBodyClick() {
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
  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.electronService.isElectron()) {
      // console.log('electron service ' + this.electronService.isElectron());
      if (event.key === 'f' && event.ctrlKey) {
        document.querySelector('body').classList.add('find');
        this.electronService.ipcRenderer.send('search-open', 'close');
      }

      if (event.key === 'Escape') {
        console.log(event);
        this.electronService.resetWindow();
        console.log('Window reset');

        this.electronService.ipcRenderer.send('search-close', 'close');
      }
    }
  }
  public ngAfterContentInit(): void {}

  public async ngOnInit(): Promise<void> {
    // this.initNoteSettingsToggle();
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
