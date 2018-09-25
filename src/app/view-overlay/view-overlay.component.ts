import { Component, OnInit, NgZone } from '@angular/core';
import { Overlay } from '../models/Overlay';
import { BodyScrollService } from '../services/body-block-scroll.service';

@Component({
  selector: 'app-view-overlay',
  templateUrl: './view-overlay.component.html',
  styleUrls: ['./view-overlay.component.scss']
})
export class ViewOverlayComponent implements OnInit {
  public top: string;
  public left: string;
  public width: string;
  public height: number;
  public overlays: Overlay[] = [];
  private lineCount: number;
  private appBodyBlock = document.getElementById('appBodyBlock');

  constructor(
    private ngZone: NgZone,
    private bodyScrollService: BodyScrollService
  ) {
    window.onresize = e => {
      // ngZone.run will help to run change detection
      this.ngZone.run(() => {
        this.setOverlaySize();
        this.addLines();
      });
    };
    this.setOverlaySize();
    this.addLines();
  }

  private setOverlaySize() {
    console.log(this.appBodyBlock.getClientRects());
    const boundingClientRect = this.appBodyBlock.getBoundingClientRect();

    this.top = boundingClientRect.top + 'px';
    this.left = boundingClientRect.left + 'px';
    this.width = boundingClientRect.width + 'px';
    this.height = boundingClientRect.height;

    console.log('top ' + this.top);
    console.log('left ' + this.left);
  }

  private addLines() {
    this.lineCount = Math.round(this.height / 20);
    console.log('line count ' + this.lineCount);

    if (this.overlays.length === this.lineCount) {
      return;
    } else if (this.overlays.length > this.lineCount) {
      while (this.overlays.length > this.lineCount) {
        this.overlays.pop();
      }
    } else {
      let count = this.overlays.length;
      while (this.overlays.length < this.lineCount) {
        count++;
        this.overlays.push(new Overlay(count));
      }
    }

    console.log('this.lines.length ' + this.overlays.length);
  }
  ngOnInit() {}

  public scrollOverlay(event: Event) {
    console.log(event);

    document.querySelector('.body').scrollBy({
      top: 150, // could be negative value
      left: 0,
      behavior: 'smooth'
    });
    // console.log(event as WheelEvent);
    // if ((event as WheelEvent).wheelDeltaY === 0) {
    //   return;
    // }
    // if ((event as WheelEvent).wheelDeltaY > 0) {
    //   this.bodyScrollService.scrollUp();
    // } else {
    //   this.bodyScrollService.scrollDown();
    // }
  }
}
