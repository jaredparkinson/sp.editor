import { Component, OnInit } from '@angular/core';
import { WTagService } from '../../services/wtag-builder.service';

@Component({
  selector: 'app-wtag-popup',
  templateUrl: './wtag-popup.component.html',
  styleUrls: ['./wtag-popup.component.scss'],
})
export class WTagPopupComponent implements OnInit {
  public colors: string[] = [
    '#fff8aa',
    '#aaf6ff',
    '#d6ffaa',
    '#FF9B9F',
    '#D7D5FC',
    '#FFBF98',
    '#ffc2e9',
    '#DDDDDD',
    '#DFCDBA',
    '#A8C7E6',
  ];
  public showColorPalette = false;
  constructor(public wTagService: WTagService) {}
  public highlightClick() {
    this.wTagService.marked = true;
    this.showColorPalette = true;
    // this.wTagService.markText();
  }

  public ngOnInit() {}
  public setColor() {}
}
