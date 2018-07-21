import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
// import { JSDOM } from 'jsdom';
import { Observable, generate } from 'rxjs';
import { map, switchMap, throttle } from 'rxjs/operators';

@Injectable()
export class NavigationService {
  private navLinks: string[] = [];
  private nav: Observable<string>;
  public bodyBlock: string;
  constructor(private httpClient: HttpClient) {
    this.initNavigation();
  }

  public getNavigation() {
    return this.httpClient.get('assets/nav/nav.html', {
      observe: 'body',
      responseType: 'text'
    });
  }
  public getChapter(book: string, chapter: string): Observable<string> {
    const url = this.urlBuilder(book, chapter);
    return this.httpClient.get(url, { observe: 'body', responseType: 'text' });
  }
  private urlBuilder(book: string, chapter: string): string {
    const url = 'assets/scriptures/';
    const urlEnd = book + '/' + chapter + '.html';
    if (chapter === '') {
      return url + 'tg/' + book + '.html';
    }
    switch (book) {
      case 'gs':
      case 'triple-index':
      case 'harmony': {
        return url + urlEnd;
      }
      default: {
        let testament = '';
        switch (book) {
          case '1-chr':
          case '1-kgs':
          case '1-sam':
          case '2-chr':
          case '2-kgs':
          case '2-sam':
          case 'amos':
          case 'dan':
          case 'deut':
          case 'eccl':
          case 'esth':
          case 'ex':
          case 'ezek':
          case 'ezra':
          case 'gen':
          case 'hab':
          case 'hag':
          case 'hosea':
          case 'isa':
          case 'jer':
          case 'job':
          case 'joel':
          case 'jonah':
          case 'josh':
          case 'judg':
          case 'lam':
          case 'lev':
          case 'mal':
          case 'micah':
          case 'nahum':
          case 'neh':
          case 'num':
          case 'obad':
          case 'prov':
          case 'ps':
          case 'ruth':
          case 'song':
          case 'zech':
          case 'zeph': {
            testament = 'ot/';
            break;
          }
          case '1-cor':
          case '1-jn':
          case '1-pet':
          case '1-thes':
          case '1-tim':
          case '2-cor':
          case '2-jn':
          case '2-pet':
          case '2-thes':
          case '2-tim':
          case '3-jn':
          case 'acts':
          case 'col':
          case 'eph':
          case 'gal':
          case 'heb':
          case 'james':
          case 'john':
          case 'jude':
          case 'luke':
          case 'mark':
          case 'matt':
          case 'philem':
          case 'philip':
          case 'rev':
          case 'rom':
          case 'titus': {
            testament = 'nt/';
            break;
          }
          case '1-ne':
          case '2-ne':
          case '3-ne':
          case '4-ne':
          case 'alma':
          case 'enos':
          case 'ether':
          case 'hel':
          case 'jacob':
          case 'jarom':
          case 'morm':
          case 'moro':
          case 'mosiah':
          case 'omni':
          case 'w-of-m': {
            testament = 'bofm/';
            break;
          }
          case 'jst-1-chr':
          case 'jst-1-cor':
          case 'jst-1-jn':
          case 'jst-1-pet':
          case 'jst-1-sam':
          case 'jst-1-thes':
          case 'jst-1-tim':
          case 'jst-2-chr':
          case 'jst-2-cor':
          case 'jst-2-pet':
          case 'jst-2-sam':
          case 'jst-2-thes':
          case 'jst-acts':
          case 'jst-amos':
          case 'jst-col':
          case 'jst-deut':
          case 'jst-eph':
          case 'jst-ex':
          case 'jst-gal':
          case 'jst-gen':
          case 'jst-heb':
          case 'jst-isa':
          case 'jst-james':
          case 'jst-jer':
          case 'jst-john':
          case 'jst-luke':
          case 'jst-mark':
          case 'jst-matt':
          case 'jst-ps':
          case 'jst-rev':
          case 'jst-rom': {
            testament = 'jst/';
            break;
          }
          case 'abr':
          case 'a-of-f':
          case 'js-h':
          case 'js-m':
          case 'moses': {
            testament = 'pgp/';
            break;
          }
          case 'od':
          case 'dc': {
            testament = 'dc-testament/';
            break;
          }
          case 'quad': {
            testament = 'quad/';
            break;
          }
          default: {
            testament = '';
          }
        }
        // console.log(url + testament + urlEnd);
        this.bodyBlock = url + testament + urlEnd;
        return url + testament + urlEnd;
      }
    }
    // if (book.trim() !== '') {
    //   url += '*/';
    //   url += book + '/' + chapter + '.html';
    // }
    // return url;
  }

  private initNavigation() {
    this.nav = this.httpClient.get('assets/nav/nav.html', {
      observe: 'body',
      responseType: 'text'
    });
  }
}
