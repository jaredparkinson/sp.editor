import { Injectable } from '@angular/core';
import * as lodash from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class StringService {
  constructor() {}
  hasAttribute(target: string, word: string) {
    return target.includes(word);
  }
  public hasAttributeArray(target: string[], word: string): boolean {
    return target.includes(word);
  }

  public addAttribute(target: string, word: string) {
    if (!target || !target.includes(word)) {
      return target + ' ' + word;
    }
    return target;
  }
  public removeAttribute(target: string, word: string) {
    if (target && target.includes(word)) {
      return target.replace(word, '').trim();
    }
    return target;
  }
  public addAttributeArray(target: string[], word: string) {
    if (!target.includes(word)) {
      target.push(word);
    }
    return target;
  }
  public removeAttributeArray(target: string[], word: string) {
    return lodash.remove(target, (c: string) => {
      return c === word;
    });
  }
}
