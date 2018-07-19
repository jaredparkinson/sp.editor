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

  private initNavigation() {
    this.nav = this.httpClient.get('assets/nav/nav.html', {
      observe: 'body',
      responseType: 'text'
    });
  }
}
