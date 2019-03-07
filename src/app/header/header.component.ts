import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import * as lodash from 'lodash';
import * as matCSS from 'materialize-css';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { EditService } from '../services/EditService';
import { HelperService } from '../services/helper.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { VerseSelectService } from '../services/verse-select.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    public helperService: HelperService,
    public chapterService: ChapterService,
    public editService: EditService,
    public saveState: SaveStateService,
    public navServices: NavigationService,
    public verseSelectService: VerseSelectService,
    private router: Router,
    public httpClient: HttpClient,
    private location: Location,
    public dataService: DataService,
    public swUpdate: SwUpdate,
  ) {}

  @ViewChildren('wtag')
  wTags2: QueryList<any>;

  ngOnInit() {}

  toggleNotes() {
    this.navServices.toggleNotes();
  }

  toggleVerseSelect() {}

  settings() {
    this.router.navigateByUrl('settings');
  }
  addressBarKeyPress(event: KeyboardEvent) {
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
      }
    }
  }

  btnBackPress() {
    this.location.back();
  }
  btnForwardPress() {
    this.location.forward();
  }

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
    this.verseSelectService.halfNotes = false;
    this.navServices.btnRightPanePress();
  }
  btnNotesSettingsPress() {
    this.navServices.btnNotesSettingsPress();
  }
  btnSecondaryNotesPress() {
    this.navServices.btnSecondaryNotesPress().then((value: boolean) => {
      this.chapterService.resetNotes();
    });
  }

  btnLeftPanePress() {
    this.navServices.btnLeftPanePress();
  }
  btnParagraphPress() {
    this.navServices.btnParagraphPress();
  }
}
