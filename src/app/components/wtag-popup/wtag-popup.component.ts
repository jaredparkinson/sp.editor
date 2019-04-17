import { Component, OnInit } from '@angular/core';
import { WTagService } from '../../services/wtag-builder.service';

@Component({
  selector: 'app-wtag-popup',
  templateUrl: './wtag-popup.component.html',
  styleUrls: ['./wtag-popup.component.scss'],
})
export class WTagPopupComponent implements OnInit {
  public colors: string[] = ['yellow','lightblue','red', 'blue', 'green'];
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
