import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import * as lodash from 'lodash';
// import { NavLinks } from '../models/navlinks.model';
import { Navigation } from '../modelsJson/Chapter';
import { ChapterService } from '../services/chapter.service';
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
  ) {}

  ngOnInit() {
    this.httpClient
      .get('assets/nav/nav_rev.json', {
        responseType: 'text',
      })
      .subscribe(data => {
        console.log();
        this.navService.navigation = JSON.parse(data) as Navigation[];
        this.setTempNav(this.navService.navigation);
      });
    // console.log(this.fileManager.folders[0].path);
    // this.addressBar = document.getElementById('addressBar') as HTMLInputElement;
  }
  setTempNav(navigation: Navigation[]): any {
    navigation.forEach(nav => {
      if (nav.url) {
        this.tempNav.push(nav);
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
      nav.visible = false;
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
      let addressBarValue = (document.getElementById(
        'addressBar',
      ) as HTMLInputElement).value;
      addressBarValue = addressBarValue.replace('/', ' ');
      this.buildUrl();
    }
  }

  private buildUrl() {
    const urlAsdf = this.urlBuilder.urlParser(
      (this.addressBar.nativeElement as HTMLInputElement).value,
    );
    console.log(urlAsdf);

    this.router.navigateByUrl(urlAsdf);
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
