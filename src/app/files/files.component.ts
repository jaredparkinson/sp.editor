import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { JSDOM } from 'jsdom';
import { File } from '../models/file';
import { FolderProtoType } from '../models/FolderProtoType';
import { NavigationService } from '../services/navigation.service';
import { NavLinks } from '../models/navlinks.model';
import { ChapterService } from '../services/chapter.service';
import { Folder } from '../models/Folder';
import { SaveStateService } from '../services/save-state.service';

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
  constructor(
    public fileManager: NavigationService,
    public chapterService: ChapterService,
    public saveState: SaveStateService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    // console.log(this.fileManager.folders[0].path);
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
      const address = addressBarValue.split(' ').filter(f => {
        return f.trim() !== '';
      });
      console.log(address);
      if (address.length >= 2) {
        this.router.navigateByUrl(address[0] + '/' + address[1]);
        // this.chapterService.getChapter(address[0], address[1]);
      }
    }
  }

  onChapterClick(book: string, chapter: string) {
    this.chapterService.getChapter(book, chapter);
  }
  public getNavigation() {
    // return this.fileManager.getNavigation();
  }
}
