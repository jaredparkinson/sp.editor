import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  faArrowLeft,
  faArrowRight,
  faBars,
  faBookOpen,
  faCaretDown,
  faGlobe,
  faListUl,
  faParagraph,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';
import { ChapterService } from '../services/chapter.service';
import { HelperService } from '../services/helper.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { VerseSelectService } from '../services/verse-select.service';
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
  faGlobe = faGlobe;
  faCaretDown = faCaretDown;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  @ViewChildren('wtag')
  wTags2: QueryList<any>;
  // leftPaneNav: HTMLElement;
  constructor(
    public helperService: HelperService,
    public chapterService: ChapterService,
    public saveState: SaveStateService,
    public navServices: NavigationService,
    public verseSelectService: VerseSelectService,
    private router: Router,
    public httpClient: HttpClient,
    private location: Location
  ) {
    // this.leftPaneNav = document.getElementById('leftPaneNav');
  }

  ngOnInit() {}

  toggleNotes() {
    this.navServices.toggleNotes();
  }

  toggleVerseSelect() {
    // this.verseSelectService.toggleVerseSelect();
    // console.log(this.wTags2);
    // this.chapterService.toggleVerseSelect(this.verseSelect);
  }

  settings() {
    this.router.navigateByUrl('settings');
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
        this.router.navigateByUrl(address[0] + '/' + address[1]);
        // this.chapterService.getChapter(address[0], address[1]);
      }
    }
  }

  btnBackPress() {
    this.location.back();
  }
  btnForwardPress() {
    this.location.forward();
  }
  // toggleNavButton(id: string, targetId: string, on: string, off: string) {
  //   this.navServices.toggleNavButton(id, targetId, on, off);
  // }
  btnNewNotesPress() {
    this.navServices.btnNewNotesPress();
  }
  btnPoetryPress() {
    this.navServices.btnPoetryPress();
  }
  btnEnglishNotesPress() {
    this.navServices.btnEnglishNotesPress();
  }
  btnTranslatorNotesPress() {
    this.navServices.btnTranslatorNotesPress();
  }
  btnOriginalNotesPress() {
    this.navServices.btnOriginalNotesPress();
  }
  btnRightPanePress() {
    this.navServices.btnRightPanePress();
  }
  btnNotesSettingsPress() {
    // const dialogConfig = new MatDialogConfig();

    // this.dialog.open(DialogBodyComponent, { width: '0px', height: '0px' });
    this.navServices.btnNotesSettingsPress();
  }
  btnSecondaryNotesPress() {
    this.navServices.btnSecondaryNotesPress().then((value: boolean) => {
      // console.log('tasdofjaosdfj');

      // this.chapterService.resetNotes();
      this.chapterService.resetVerseSelect();
    });
  }
  btnLeftPanePress() {
    this.navServices.btnLeftPanePress();
  }
  btnParagraphPress() {
    this.navServices.btnParagraphPress();
    this.chapterService.scrollIntoView.scrollIntoView();
    console.log(this.chapterService.scrollIntoView);
  }
}
