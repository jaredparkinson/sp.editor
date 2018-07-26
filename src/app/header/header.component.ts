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
    private chapterService: ChapterService
  ) {
    this.leftPaneNav = document.getElementById('leftPaneNav');
  }

  ngOnInit() {}

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
    this.helperService.toggleNavButton(id, targetId, on, off);
    // const element = document.getElementById(id);
    // const target = document.getElementById(targetId);

    // if (target.classList.contains(off)) {
    //   target.classList.add(on);
    //   element.classList.add('nav-btn-on');
    //   target.classList.remove(off);
    // } else {
    //   target.classList.add(off);
    //   element.classList.remove('nav-btn-on');
    //   target.classList.remove(on);
    // }
    // console.log(element);
    // console.log(target);
  }
}
