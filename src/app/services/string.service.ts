import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringService {
  hasAttribute(target: string, word: string) {
    return target.includes(word);
  }
  constructor() {}

  public addAttribute(target: string, word: string) {
    if (!target.includes(word)) {
      return target + ' ' + word;
    }
    return target;
  }
  public removeAttribute(target: string, word: string) {
    if (target.includes(word)) {
      return target.replace(word, '').trim();
    }
    return target;
  }
}
