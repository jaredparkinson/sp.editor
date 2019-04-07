import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { first, last } from 'lodash';
import { ISaveStateItem } from '../models/ISaveStateItem';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { EditService } from '../services/EditService';
import { HelperService } from '../services/helper.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
// import { VerseSelectService } from '../services/verse-select.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public cloneRange: Range;
  public getSelection: Selection;
  public resizeTimeout: any;
  // faBars = faBars;
  // faParagraph = faParagraph;
  // faBookOpen = faBookOpen;
  // faPlus = faPlus;
  // faListUl = faListUl;
  // faGlobe = faGlobe;
  // faCaretDown = faCaretDown;
  // faArrowLeft = faArrowLeft;
  // faArrowRight = faArrowRight
  @ViewChildren('wtag')
  public wTags2: QueryList<any>;
  // leftPaneNav: HTMLElement;
  constructor(
    public helperService: HelperService,
    public chapterService: ChapterService,
    public editService: EditService,
    public saveState: SaveStateService,
    public navServices: NavigationService,
    // public verseSelectService: VerseSelectService,
    private router: Router,
    public httpClient: HttpClient,
    private location: Location,
    public dataService: DataService,
    public swUpdate: SwUpdate,
  ) {
    setInterval(() => {
      if (
        window.getSelection().rangeCount > 0 &&
        window
          .getSelection()
          .toString()
          .trim() !== ''
      ) {
        this.getSelection = window.getSelection();
        this.cloneRange = window
          .getSelection()
          .getRangeAt(0)
          .cloneRange();
        // console.log(this.getSelection.getRangeAt(0).cloneRange());
      }
      // console.log();/
    }, 100);
    // this.leftPaneNav = document.getElementById('leftPaneNav');
  }
  public addressBarKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      let addressBarValue = (document.getElementById(
        'addressBar',
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

  public btnBackPress() {
    this.location.back();
  }
  public btnEnglishNotesPress() {
    this.navServices.btnEnglishNotesPress();
  }
  public btnForwardPress() {
    this.location.forward();
  }

  public btnHeaderButtonPress(saveStateItem: ISaveStateItem<boolean>) {
    saveStateItem.value = !saveStateItem.value;
    saveStateItem.animated = true;

    setTimeout(() => {
      saveStateItem.animated = false;
      this.saveState.save();
    }, 500);
  }

  public btnLeftPanePress() {
    this.navServices.btnLeftPanePress();
  }
  // toggleNavButton(id: string, targetId: string, on: string, off: string) {
  //   this.navServices.toggleNavButton(id, targetId, on, off);
  // }
  public btnNewNotesPress() {
    this.navServices.btnNewNotesPress();
  }
  public btnNotesSettingsPress() {
    // const dialogConfig = new MatDialogConfig();

    // this.dialog.open(DialogBodyComponent, { width: '0px', height: '0px' });
    this.navServices.btnNotesSettingsPress();
  }
  public btnOriginalNotesPress() {
    this.navServices.btnOriginalNotesPress();
  }
  public btnParagraphPress() {
    this.navServices.btnParagraphPress();
  }
  public btnPoetryPress() {
    this.navServices.btnPoetryPress();
  }
  public btnRightPanePress() {
    // this.verseSelectService.halfNotes = false;
    this.navServices.btnRightPanePress();
  }
  public btnSecondaryNotesPress() {
    this.navServices.btnSecondaryNotesPress().then(() => {
      this.chapterService.resetNotes();
    });
  }
  public btnTranslatorNotesPress() {
    this.navServices.btnTranslatorNotesPress();
  }

  public markText() {
    const range = this.cloneRange;
    if (
      !(
        range.startContainer === range.endContainer &&
        range.startOffset === range.endOffset
      )
    ) {
      const startContainer = range.startContainer.parentElement;
      const endContainer = range.endContainer.parentElement;
      let vereParent = range.commonAncestorContainer as Element;
      while (
        !vereParent.classList ||
        (vereParent.classList &&
          !(vereParent as Element).classList.contains('verse') &&
          !(vereParent.nodeName === 'span'))
      ) {
        vereParent = vereParent.parentNode as Element;
      }
      const sC = {
        startID: first(
          range.startContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        lastID: last(
          range.startContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        offSet: range.startOffset,
      };
      const eC = {
        startID: first(
          range.endContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        lastID: last(
          range.endContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        offSet: range.endOffset,
      };
      console.log(
        range.toString() ===
          vereParent.textContent.substring(
            parseInt(sC.startID) + sC.offSet,
            parseInt(eC.startID) + eC.offSet,
          ),
      );
      if (range.startContainer === range.endContainer) {
        // console.log(vereParent);
        console.log();

        console.log(vereParent.textContent);

        console.log(sC);
        console.log(eC);

        console.log(
          range.startContainer.textContent.substring(sC.offSet, eC.offSet),
        );
      }
    }
  }

  public ngOnInit() {}

  public settings() {
    this.router.navigateByUrl('settings');
  }

  public toggleNotes() {
    this.navServices.toggleNotes();
  }

  public toggleVerseSelect() {
    // this.verseSelectService.toggleVerseSelect();
    // console.log(this.wTags2);
    // this.chapterService.toggleVerseSelect(this.verseSelect);
  }
}
