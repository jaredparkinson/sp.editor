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
import { NavigationService } from '../navigation.service';
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
    private saveState: SaveStateService,
    private navServices: NavigationService
  ) {
    this.leftPaneNav = document.getElementById('leftPaneNav');
  }

  ngOnInit() { }

  toggleNotes() {
    this.navServices.toggleNotes();
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
    this.navServices.toggleNavButton(id, targetId, on, off);
  }

  btnRightPanePress() {
    this.navServices.btnRightPanePress();
  }
  btnLeftPanePress() {
    this.navServices.btnLeftPanePress();
  }
  btnParagraphPress() {
    this.navServices.btnParagraphPress();
  }
}
