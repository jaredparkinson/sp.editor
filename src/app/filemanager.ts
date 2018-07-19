import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap, throttle } from 'rxjs/operators';
import { Injectable } from '../../node_modules/@angular/core';
@Injectable()
export class FileManager {
  private nav: string;
  constructor(private httpClient: HttpClient) {
    this.getChapers();
    // console.log(this.nav);
  }

  //scriptures\ot\2-chr
  getChapers() {
    this.nav = this.httpClient
      .get('assets/nav/nav.html', {
        observe: 'body',
        responseType: 'text'
      })
      .pipe(
        map(data => {
          return data;
        })
      )
      .subscribe(t => {
        console.log(t);
        return t;
      });
  }
}
