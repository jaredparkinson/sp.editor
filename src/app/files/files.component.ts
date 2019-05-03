import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import {} from 'lodash';

import { SearchComponent } from '../search/search.component';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { SearchService } from '../services/search.service';
import { UrlBuilder } from './UrlBuilder';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  @ViewChild('addressBar') public addressBar: ElementRef;
  public booksVisible = false;
  public displayNavTitle = true;
  public foldersVisible = true;
  public resizeTimeout: any;

  public tempNav: Navigation[] = [];
  constructor(
    public fileManager: NavigationService,
    public chapterService: ChapterService,
    public saveState: SaveStateService,
    public navService: NavigationService,
    private router: Router,
    private urlBuilder: UrlBuilder,
    public httpClient: HttpClient,
    private searchService: SearchService,
  ) {}

  public addressBarClick() {
    (this.addressBar.nativeElement as HTMLInputElement).select();
  }
  public addressBarFocus() {
    const addressBar = document.getElementById('addressBar');
    addressBar.focus();
  }
  public async addressBarKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.buildUrl();
    }
  }

  public displayNavShortTitle() {
    const nav = document.querySelector('div.navigation-pane');

    return nav ? (nav as HTMLElement).offsetWidth < 200 : false;
  }
  public displayNavTitle2() {
    const nav = document.querySelector('div.navigation-pane');

    return nav ? (nav as HTMLElement).offsetWidth > 200 : false;
  }

  public ngOnInit() {}

  public onChapterClick() {}
  @HostListener('window:resize')
  public onWindowResize() {
    // debounce resize, wait for resize to finish before doing stuff
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      console.log('Resize complete');
      const nav = document.querySelector('div.navigation-pane');

      this.displayNavTitle = nav
        ? (nav as HTMLElement).offsetWidth > 200
        : false;
      // this.setLeft();
    }, 50);
  }
  public resetNavigation() {
    this.saveState.navigation.forEach(nav => {
      nav.subNavigationVisible = false;
      nav.hide = false;
    });
  }

  public setRoot() {
    this.saveState.data.foldersVisible = true;
    this.fileManager.showBooks = false;
  }

  public settings() {
    this.router.navigateByUrl('settings');
  }

  public swipeRight(event: Event) {
    this.navService.btnLeftPanePress();
  }

  private async buildUrl() {
    const addressBarValue = (document.getElementById(
      'addressBar',
    ) as HTMLInputElement).value;

    try {
      const url = await this.urlBuilder.urlParser(addressBarValue);
      this.router.navigateByUrl(url);
    } catch (error) {
      this.router.navigate(['/search', addressBarValue]);
    }
  }
}
