import {
  Component,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';

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
import * as _ from 'lodash';
import { ChapterService } from '../services/chapter.service';
import { HelperService } from '../services/helper.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
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
  versionNumber = '';
  @ViewChildren('wtag')
  wTags2: QueryList<any>;
  // leftPaneNav: HTMLElement;
  constructor(
    public helperService: HelperService,
    public chapterService: ChapterService,
    public saveState: SaveStateService,
    public navServices: NavigationService,
    private router: Router,
    public httpClient: HttpClient,
    private location: Location,
    private ngZong: NgZone
  ) {
    // this.leftPaneNav = document.getElementById('leftPaneNav');
  }

  ngOnInit() {
    this.httpClient
      .get('assets/version.txt', { observe: 'body', responseType: 'text' })
      .subscribe(data => {
        const regex = new RegExp(/\d(\.\d{1,3}){1,2}/);
        this.versionNumber = regex.exec(data)[0];
        console.log('data ' + this.versionNumber);
      });
  }

  toggleNotes() {
    this.navServices.toggleNotes();
  }

  toggleVerseSelect() {
    this.chapterService.verseSelect = !this.chapterService.verseSelect;

    // console.log(this.wTags2);
    this.ngZong.run(() => {
      switch (this.chapterService.verseSelect) {
        case true: {
          const parser = new DOMParser();
          _.each(this.chapterService.paragraphs, paragraph => {
            _.each(paragraph.verses, verse => {
              const doc = parser.parseFromString(verse.innerHtml, 'text/html');

              _.each(doc.querySelectorAll('w'), w => {
                const ids = w.getAttribute('n').split('-');
                if (
                  _.find(this.chapterService.wTagRefs, wTagRef => {
                    return (
                      (wTagRef as HTMLElement).getAttribute('n') === ids[1] &&
                      (wTagRef as HTMLElement).parentElement.id === ids[0]
                    );
                  })
                ) {
                  w.classList.add('verse-select-0');
                }

                // console.log(w);
                // console.log(w);
              });
              // console.log(doc.querySelector('body').innerHTML);

              verse.innerHtml = doc.querySelector('body').innerHTML;
            });
          });

          break;
        }
        case false:
        default: {
          const parser = new DOMParser();
          _.each(this.chapterService.paragraphs, paragraph => {
            _.each(paragraph.verses, verse => {
              const doc = parser.parseFromString(verse.innerHtml, 'text/html');

              _.each(doc.querySelectorAll('w'), w => {
                w.className = '';
                // console.log(w);
              });
              // console.log(doc.querySelector('body').innerHTML);
              verse.innerHtml = doc.querySelector('body').innerHTML;
            });
          });
          break;
        }
      }
    });

    // this.chapterService.toggleVerseSelect(this.verseSelect);
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
    this.navServices.btnSecondaryNotesPress();
    this.chapterService.resetNotes();
  }
  btnLeftPanePress() {
    this.navServices.btnLeftPanePress();
  }
  btnParagraphPress() {
    this.navServices.btnParagraphPress();
  }
}
