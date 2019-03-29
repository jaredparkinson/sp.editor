import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import {} from 'lodash';
import * as Yallist from 'yallist';
import { Navigation } from '../modelsJson/Navigation';
import { ChapterService } from '../services/chapter.service';
import { DatabaseService } from '../services/database.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { UrlBuilder } from './UrlBuilder';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  // public links: NavLinks[] = [];
  public foldersVisible = true;
  public booksVisible = false;

  public asasdf: Yallist<Navigation> = new Yallist<Navigation>();
  public tempNav: Navigation[] = [];
  // private addressBar: HTMLInputElement;
  @ViewChild('addressBar') addressBar: ElementRef;
  constructor(
    public fileManager: NavigationService,
    public chapterService: ChapterService,
    public saveState: SaveStateService,
    public navService: NavigationService,
    private router: Router,
    private urlBuilder: UrlBuilder,
    public httpClient: HttpClient,
    public databaseService: DatabaseService,
  ) {}

  ngOnInit() {
    this.httpClient
      .get('assets/nav/nav_rev.json', {
        responseType: 'text',
      })
      .subscribe(data => {
        console.log();
        this.navService.navigation = JSON.parse(data) as Navigation[];

        this.navService.navigation.forEach(nav => {
          this.flattenNavigation(this.navService.flatNavigation, nav);
        });
        // this.setTempNav(this.navService.navigation);

        // this.asasdf.forEach(v => {
        //   if (v.url === 'gen/1') {
        //     throw 0;
        //   }
        // });
      });
    // console.log(this.fileManager.folders[0].path);
    // this.addressBar = document.getElementById('addressBar') as HTMLInputElement;
  }

  displayNavShortTitle() {
    const nav = document.querySelector('div.navigation-pane');

    return nav ? (nav as HTMLElement).offsetWidth < 200 : false;
  }
  displayNavTitle() {
    const nav = document.querySelector('div.navigation-pane');

    return nav ? (nav as HTMLElement).offsetWidth > 200 : false;
  }
  flattenNavigation(navigation: Navigation[], parentNavigation: Navigation) {
    if (parentNavigation.navigation) {
      parentNavigation.navigation.forEach(nav => {
        this.flattenNavigation(navigation, nav);
      });
    } else {
      navigation.push(parentNavigation);
    }
  }

  setTempNav(navigation: Navigation[]): any {
    navigation.forEach(nav => {
      if (nav.url) {
        this.asasdf.push(nav);
        // this.tempNav.push(nav);
      } else {
        this.setTempNav(nav.navigation);
      }
    });
  }

  swipeRight(event: Event) {
    console.log('asdoifjasdoifj');

    console.log(event);
    this.navService.btnLeftPanePress();
  }
  resetNavigation() {
    this.navService.navigation.forEach(nav => {
      nav.subNavigationVisible = false;
      nav.hide = false;
    });
  }
  // setVisibility(path: string) {
  //   this.fileManager.getNavigation(path);
  // }
  setRoot() {
    this.saveState.data.foldersVisible = true;
    this.fileManager.showBooks = false;
    // this.fileManager.books = [];
  }
  addressBarFocus() {
    const addressBar = document.getElementById('addressBar');
    addressBar.focus();
  }
  addressBarKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      // addressBarValue = addressBarValue.replace('/', ' ');
      this.buildUrl();
    }
  }

  private buildUrl() {
    const addressBarValue = (document.getElementById(
      'addressBar',
    ) as HTMLInputElement).value;
    // const urlAsdf =

    this.urlBuilder
      .urlParser(addressBarValue)
      .then(urlAsdf => {
        this.router.navigateByUrl(urlAsdf);
      })
      .catch(() => {
        console.log(this.databaseService.index.search(addressBarValue));
      });
    // const reg = new RegExp(/\w+\/.*/g);

    // if (reg.test(urlAsdf)) {
    //   // console.log(urlAsdf.includes(/.*//.*/g));

    //   this.router.navigateByUrl(urlAsdf);
    // } else {
    // }
  }

  onChapterClick(book: string, chapter: string) {
    // this.chapterService.getChapterOld(book, chapter);
  }
  // public getNavigation() {}

  settings() {
    this.router.navigateByUrl('settings');
  }

  addressBarClick() {
    (this.addressBar.nativeElement as HTMLInputElement).select();
  }
}
