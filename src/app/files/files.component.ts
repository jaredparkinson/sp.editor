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
  constructor(
    private fileManager: NavigationService,
    private chapterService: ChapterService
  ) {}

  ngOnInit() {
    this.fileManager.getNavigation().subscribe(s => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(s, 'text/html');

      const linkTags = doc.getElementsByTagName('a');

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < linkTags.length; index++) {
        const element = linkTags[index];
        this.links.push(new NavLinks(element.getAttribute('href')));
      }
    });
  }

  onChapterClick(book: string, chapter: string) {
    this.chapterService.getChapter(book, chapter);
  }
  public getNavigation() {
    return this.fileManager.getNavigation();
  }
}
