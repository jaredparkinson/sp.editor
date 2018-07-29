import { Component, OnInit } from '@angular/core';

import {
  faBars,
  faBookOpen,
  faListUl,
  faParagraph,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { ChapterService } from '../shared/chapter.service';
import { HelperService } from '../shared/helper.service';
import { SaveStateService } from '../shared/save-state.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faBars = faBars;
  faParagraph = faParagraph;
  faBookOpen = faBookOpen;
  faPlus = faPlus;
  faListUl = faListUl;
  leftPaneNav: HTMLElement;
  constructor(
    private helperService: HelperService,
    private chapterService: ChapterService,
    private saveState: SaveStateService
  ) {
    this.leftPaneNav = document.getElementById('leftPaneNav');
  }

  ngOnInit() { }

  toggleNotes() {
    console.log('test');
  }

  togglePane(id: string, minViewWidth: number) {
    // console.log('test');
    this.helperService.togglePane2(id, minViewWidth);
  }

  addressBarKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      let addressBarValue = (document.getElementById(
        'addressBar'
      ) as HTMLInputElement).value;
      addressBarValue = addressBarValue.replace('/', ' ');
      const address = addressBarValue.split(' ').filter(f => {
        return f.trim() !== '';
      });
      console.log(address);
      if (address.length >= 2) {
        this.chapterService.getChapter(address[0], address[1]);
      }
    }
  }

  toggleNavButton(id: string, targetId: string, on: string, off: string) {
    this.saveState.paragraphsVisible = !this.saveState.paragraphsVisible;
  }

  btnRightPanePress() {
    if (this.helperService.getWidth() >= 1080) {

      this.saveState.rightPanePin = !this.saveState.rightPanePin;
    }
    else {
      console.log(this.helperService.getWidth());
      this.saveState.rightPaneToggle = this.saveState.rightPaneToggle;
    }
  }
  btnParagraphPress() {
    this.saveState.paragraphsVisible = !this.saveState.paragraphsVisible;
  }
}
