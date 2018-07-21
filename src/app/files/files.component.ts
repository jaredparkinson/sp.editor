import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { File } from '../file';
import { NavigationService } from '../navigation.service';
import { NavLinks } from '../navlinks.model';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  private links: NavLinks[] = [];
  private baseFolder: string;
  private nav: string;
  private file: File;
  constructor(
    private fileManager: NavigationService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.fileManager.getNavigation().subscribe(s => {
      const cheerio = require('cheerio');
      const $ = new cheerio.load(s);

      const linkTags = $('a');

      linkTags.each((i, tag) => {
        this.links.push(new NavLinks($(tag).attr('href')));
      });
    });
  }

  onChapterClick(book: string, chapter: string) {
    this.fileManager.urlBuilder(book, chapter);
  }
  public getNavigation() {
    return this.fileManager.getNavigation();
  }
}
