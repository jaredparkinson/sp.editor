import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { File } from '../file';
import { NavigationService } from '../navigation.service';
import { NavLinks } from '../navlinks.model';
import { Router } from '@angular/router';

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
    private router: Router,
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
      // const jsdom = new JSDOM(t).window;
      // console.log(jsdom.document.childNodes);
    });
  }

  onChapterClick(book: string, chapter: string) {
    console.log(
      this.fileManager.urlBuilder(book, chapter) + ' ' + book + ' ' + chapter
    );
    // this.router.navigate(['/servers', id, 'edit'], {queryParams: {allowEdit: '1'}, fragment: 'loading'});
  }

  public getNavigation() {
    return this.fileManager.getNavigation();
  }
}
