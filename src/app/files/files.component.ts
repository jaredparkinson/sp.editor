import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'underscore';
// import { JSDOM } from 'jsdom';
import { File } from '../models/file';
import { Folder } from '../models/Folder';
import { FolderProtoType } from '../models/FolderProtoType';
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
  private baseFolder: string;
  private nav: string;
  private file: File;
  private map: Map<string, NavLinks[]> = new Map<string, NavLinks[]>();
  private addressBar: HTMLInputElement;
  constructor(
    public fileManager: NavigationService,
    public chapterService: ChapterService,
    public saveState: SaveStateService,
    public navService: NavigationService,
    private router: Router,
    private httpClient: HttpClient
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
    // folder.visible = !folder.visible;
    // if (folder.visible) {
    //   this.fileManager.navLinks = folder.folders;
    //   this.saveState.data.foldersVisible = false;
    //   // this.booksVisible = true;
    //   // console.log(folder);
    // } else {
    //   this.fileManager.navLinks = [];
    // }
    // this.fileManager.getNavigation(manifest).subscribe(s => {
    //   const parser = new DOMParser();
    //   const doc = parser.parseFromString(s, 'text/html');
    //   const linkTags = doc.getElementsByTagName('a');
    //   // tslint:disable-next-line:prefer-for-of
    //   for (let index = 0; index < linkTags.length; index++) {
    //     // console.log(element);
    //     const element = linkTags[index];
    //     this.links.push(
    //       new NavLinks(element.getAttribute('href').replace('?', ''))
    //     );
    //   }
    //   this.map.set(id, this.links);
    // });
  }
  addressBarKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      let addressBarValue = (document.getElementById(
        'addressBar'
      ) as HTMLInputElement).value;
      addressBarValue = addressBarValue.replace('/', ' ');
      this.buildUrl();

      // const address = this.addressBar.value
      //   .replace('/', ' ')
      //   .split(' ')
      //   .filter(f => {
      //     return f.trim() !== '';
      //   });
      // // const address = addressBarValue.split(' ').filter(f => {
      // //   return f.trim() !== '';
      // // });
      // console.log(address);
      // if (address.length >= 2) {
      //   this.router.navigateByUrl(address[0] + '/' + address[1]);
      //   // this.chapterService.getChapter(address[0], address[1]);
      // }
    }
  }

  private buildUrl() {
    // const text = this.addressBar.value.trim().split(' ');

    const aasdf = new UrlBuilder();
    // console.log(
    //   'contains ' +
    //     _.contains(
    //       ['0', '1', '2', '3', '4', '5', '6', '8', '9'],
    //       text[0].split('-')[0]
    //     )
    // );
    const urlAsdf = aasdf.urlParser(this.addressBar.value); //.split(' ');
    console.log(urlAsdf);

    // console.log(urlAsdf[0] + '/' + urlAsdf[1].replace(':', '.'));
    this.router.navigateByUrl(urlAsdf); //[0] + '/' + urlAsdf[1].replace(':', '.'));
    // console.log('text ' + text[0]);
    // if (text.length === 0) {
    //   return '';
    // } else if (text[0] === '1') {
    //   console.log('number');
    // }
    // return '';
  }

  onChapterClick(book: string, chapter: string) {
    this.chapterService.getChapter(book, chapter, null);
  }
  public getNavigation() {
    // return this.fileManager.getNavigation();
  }
}
