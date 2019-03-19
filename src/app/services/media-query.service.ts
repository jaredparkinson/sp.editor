import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryService {
  constructor() {}

  public isSmallScreen(): boolean {
    return window.matchMedia(
      `screen and (max-width: 499.98px), (orientation: portrait) and (max-width: 1023.98px)`,
    ).matches;
  }
}
