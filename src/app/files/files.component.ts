import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { JSDOM } from 'jsdom';
import { File } from '../file';
import { Folder } from '../Folder';
import { NavigationService } from '../navigation.service';
import { NavLinks } from '../navlinks.model';
import { ChapterService } from '../shared/chapter.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  public links: NavLinks[] = [];
  private baseFolder: string;
  private nav: string;
  private file: File;
  private map: Map<string, NavLinks[]> = new Map<string, NavLinks[]>();
  constructor(
    private fileManager: NavigationService,
    private chapterService: ChapterService
  ) { }

  ngOnInit() {
    // console.log(this.fileManager.folders[0].path);
  }
  setVisibility(path: string) {
    console.log(path);
    this.fileManager.folders.find(f => f.path === path).setVisibility();
  }
  setLinks(manifest: string) {
    this.fileManager.getNavigation(manifest);
    console.log(manifest);

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

  onChapterClick(book: string, chapter: string) {
    this.chapterService.getChapter(book, chapter);
  }
  public getNavigation() {
    // return this.fileManager.getNavigation();
  }
}
