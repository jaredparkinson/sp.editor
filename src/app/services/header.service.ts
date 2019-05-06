import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public pageName: string = '';
  public pageShortName: string = '';
}
