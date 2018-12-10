import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as lodash from 'lodash';
import { NavLinks } from '../models/navlinks.model';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { UrlBuilder } from './UrlBuilder';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  public links: NavLinks[] = [];
  public foldersVisible = true;
  public booksVisible = false;
  private addressBar: HTMLInputElement;
  constructor(
    public fileManager: NavigationService,
    public chapterService: ChapterService,
    public saveState: SaveStateService,
    public navService: NavigationService,
    private router: Router,
    private urlBuilder: UrlBuilder
  ) {}

  ngOnInit() {
    // console.log(this.fileManager.folders[0].path);
    this.addressBar = document.getElementById('addressBar') as HTMLInputElement;
  }
  setVisibility(path: string) {
    this.fileManager.getNavigation(path);
  }
  setRoot() {
    this.saveState.data.foldersVisible = true;
    this.fileManager.showBooks = false;
    this.fileManager.books = [];
  }
  setTestament(folder: string) {
    this.fileManager.getTestament(folder);
  }
  addressBarKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      let addressBarValue = (document.getElementById(
        'addressBar'
      ) as HTMLInputElement).value;
      addressBarValue = addressBarValue.replace('/', ' ');
      this.buildUrl();
    }
  }

  private buildUrl() {
    const urlAsdf = this.urlBuilder.urlParser(this.addressBar.value);
    console.log(urlAsdf);

    this.router.navigateByUrl(urlAsdf);
  }

  onChapterClick(book: string, chapter: string) {
    this.chapterService.getChapter(book, chapter);
  }
  public getNavigation() {}

  settings() {
    this.router.navigateByUrl('settings');
  }
}
