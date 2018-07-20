import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { JSDOM } from 'jsdom';
import { Observable } from 'rxjs';
import { map, switchMap, throttle } from 'rxjs/operators';

@Injectable()
export class NavigationService {
  private navLinks: string[] = [];
  private nav: Observable<string>;
  constructor(private httpClient: HttpClient) {
    this.initNavigation();
  }

  public getNavigation() {
    return this.httpClient.get('assets/nav/nav.html', {
      observe: 'body',
      responseType: 'text'
    });
  }
  public urlBuilder(book: string, chapter: string): string {
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
        break;
      }
      default: {
        return url + '*/' + urlEnd;
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
