import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BodyScrollService {
  public top = 90;
  private scrollTotal = 18;
  constructor() {}

  public scrollDown() {
    this.top -= this.scrollTotal;

    // for (let x = 0; x < 5; x++) {
    //   this.top--;
    // }
  }
  public scrollUp() {
    if (this.top !== 90) {
      this.top += this.scrollTotal;
    }
  }
}
