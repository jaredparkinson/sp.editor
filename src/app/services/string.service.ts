import { Injectable } from '@angular/core';

import { remove } from 'lodash';
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
      // console.log(word);

      target.push(word);
      // console.log(target);
    }
    return target;
  }
  public removeAttributeArray(target: string[], word: string) {
    return remove(target, (c: string) => {
      // console.log(c);

      return c !== word;
    });
  }

  public arrayToString(array: string[]): string {
    return array.toString().replace(/\,/g, ' ');
  }
}
