import { Component, OnInit } from '@angular/core';
import { WTagService } from '../../services/wtag-builder.service';

@Component({
  selector: 'app-wtag-popup',
  templateUrl: './wtag-popup.component.html',
  styleUrls: ['./wtag-popup.component.scss'],
})
export class WTagPopupComponent implements OnInit {
  public colors: string[] = [
    'highlight-yellow',
    'highlight-lightblue',
    'highlight-green',
    'highlight-red',
    'highlight-purple',
    'highlight-orange',
    'highlight-pink',
    'highlight-lightgrey',
    'highlight-brown',
    'highlight-bluegrey',
  ];
  public showColorPalette = false;
  constructor(public wTagService: WTagService) {}
  public highlightClick() {
    this.wTagService.marked = true;
    this.showColorPalette = !this.showColorPalette;
    // this.wTagService.markText();
  }

  public addHighlight(color: string) {}

  public ngOnInit() {}
  public setColor() {}
}
