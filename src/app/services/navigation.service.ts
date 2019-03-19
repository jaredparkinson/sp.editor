import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ISaveStateItem } from '../models/ISaveStateItem';
import { Navigation } from '../modelsJson/Navigation';
import { SaveStateService } from './save-state.service';

@Injectable()
export class NavigationService {
  public leftPaneToggle = false;
  public rightPaneToggle = false;
  public bodyBlock: string;
  public showBooks = false;
  public notesSettings = false;
  public pageTitle: string;
  public navigation: Navigation[] = [];

  constructor(
    private httpClient: HttpClient,
    private saveState: SaveStateService,
  ) {}

  toggleNotes() {}
  navigationClick(navigation: Navigation, navigations: Navigation[]) {
    navigation.visible = navigation.visible ? !navigation.visible : true;

    if (navigation.visible) {
      navigations.forEach(nav => {
        if (nav !== navigation) {
          nav.hide = true;
          nav.visible = false;
        }
      });
    } else {
      navigations.forEach(nav => {
        nav.visible = false;
        nav.hide = false;
      });
      if (navigation.navigation) {
        navigation.navigation.forEach(nav => {
          nav.visible = false;
          nav.hide = false;
        });
      }
    }
  }
  btnPoetryPress(): Promise<boolean> {
    return new Promise<boolean>(() => {
      this.saveState.data.poetryVisible = !this.saveState.data.poetryVisible;
      this.saveState.save();
    });
  }
  btnSecondaryNotesPress(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.saveState.data.secondaryNotesVisible = !this.saveState.data
        .secondaryNotesVisible;
      this.saveState.save();
      resolve(true);
    });
  }
  btnOriginalNotesPress(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.saveState.data.originalNotesVisible = !this.saveState.data
        .originalNotesVisible;
      this.saveState.save();
      resolve(true);
    });
  }
  btnTranslatorNotesPress(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.saveState.data.translatorNotesVisible = !this.saveState.data
        .translatorNotesVisible;
      this.saveState.save();
      resolve(true);
    });
  }
  btnEnglishNotesPress(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.saveState.data.englishNotesVisible = !this.saveState.data
        .englishNotesVisible;
      this.saveState.save();
      resolve(true);
    });
  }
  async btnNewNotesPress(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.saveState.data.newNotesVisible = !this.saveState.data
        .newNotesVisible;
      this.saveState.save();
      resolve(true);
    });
  }
  toggleNavButton() {
    this.saveState.data.paragraphsVisible = !this.saveState.data
      .paragraphsVisible;
  }

  documentBodyClick(e: Event) {
    if ((e.target as HTMLElement).closest('.notes-settings') === null) {
      this.notesSettings = false;
      document
        .querySelector('div.main.grid')
        .removeEventListener('click', this.documentBodyClick);
    }
  }
  btnNotesSettingsPress() {
    this.notesSettings = !this.notesSettings;
  }
  btnRightPanePress() {
    this.saveState.data.rightPanePin = !this.saveState.data.rightPanePin;
    this.saveState.save();
  }
  btnLeftPanePress() {
    this.saveState.data.leftPanePin = !this.saveState.data.leftPanePin;

    this.saveState.save();
  }
  btnParagraphPress() {
    this.saveState.data.paragraphsVisible = !this.saveState.data
      .paragraphsVisible;
    this.saveState.save();
  }

  public getChapter(book: string, chapter: string): Observable<string> {
    const url = 'assets/' + this.urlBuilder(book, chapter);

    return this.httpClient.get(url, { observe: 'body', responseType: 'text' });
  }

  btnHeaderButtonPress(
    saveStateItem: ISaveStateItem<boolean>,
    value: boolean = false,
  ) {
    saveStateItem.value = value;
    saveStateItem.animated = true;

    setTimeout(() => {
      saveStateItem.animated = false;
      this.saveState.save();
    }, 500);
  }
  public getTestament(): void {}

  public urlBuilder(book: string, chapter: string): string {
    const url = 'scriptures/';
    const urlEnd = book + '/' + chapter + '.html';
    if (chapter === '') {
      return url + 'tg/' + book + '.html';
    }
    switch (book) {
      default: {
        let testament = '';
        switch (book) {
          case '1-chr':
          case '1-kgs':
          case '1-sam':
          case '2-chr':
          case '2-kgs':
          case '2-sam':
          case 'amos':
          case 'dan':
          case 'deut':
          case 'eccl':
          case 'esth':
          case 'ex':
          case 'ezek':
          case 'ezra':
          case 'gen':
          case 'hab':
          case 'hag':
          case 'hosea':
          case 'isa':
          case 'jer':
          case 'job':
          case 'joel':
          case 'jonah':
          case 'josh':
          case 'judg':
          case 'lam':
          case 'lev':
          case 'mal':
          case 'micah':
          case 'nahum':
          case 'neh':
          case 'num':
          case 'obad':
          case 'prov':
          case 'ps':
          case 'ruth':
          case 'song':
          case 'zech':
          case 'zeph': {
            testament = 'ot/';
            break;
          }
          case '1-cor':
          case '1-jn':
          case '1-pet':
          case '1-thes':
          case '1-tim':
          case '2-cor':
          case '2-jn':
          case '2-pet':
          case '2-thes':
          case '2-tim':
          case '3-jn':
          case 'acts':
          case 'col':
          case 'eph':
          case 'gal':
          case 'heb':
          case 'james':
          case 'john':
          case 'jude':
          case 'luke':
          case 'mark':
          case 'matt':
          case 'philem':
          case 'philip':
          case 'rev':
          case 'rom':
          case 'titus': {
            testament = 'nt/';
            break;
          }
          case '1-ne':
          case '2-ne':
          case '3-ne':
          case '4-ne':
          case 'alma':
          case 'enos':
          case 'ether':
          case 'hel':
          case 'jacob':
          case 'jarom':
          case 'morm':
          case 'moro':
          case 'mosiah':
          case 'omni':
          case 'w-of-m': {
            testament = 'bofm/';
            break;
          }
          case 'jst-1-chr':
          case 'jst-1-cor':
          case 'jst-1-jn':
          case 'jst-1-pet':
          case 'jst-1-sam':
          case 'jst-1-thes':
          case 'jst-1-tim':
          case 'jst-2-chr':
          case 'jst-2-cor':
          case 'jst-2-pet':
          case 'jst-2-sam':
          case 'jst-2-thes':
          case 'jst-acts':
          case 'jst-amos':
          case 'jst-col':
          case 'jst-deut':
          case 'jst-eph':
          case 'jst-ex':
          case 'jst-gal':
          case 'jst-gen':
          case 'jst-heb':
          case 'jst-isa':
          case 'jst-james':
          case 'jst-jer':
          case 'jst-john':
          case 'jst-luke':
          case 'jst-mark':
          case 'jst-matt':
          case 'jst-ps':
          case 'jst-rev':
          case 'jst-rom': {
            testament = 'jst/';
            break;
          }
          case 'abr':
          case 'a-of-f':
          case 'js-h':
          case 'js-m':
          case 'moses': {
            testament = 'pgp/';
            break;
          }
          case 'od':
          case 'dc': {
            testament = 'dc-testament/';
            break;
          }
          case 'quad': {
            testament = 'quad/';
            break;
          }
          default: {
            testament = '';
          }
        }

        this.bodyBlock = url + testament + urlEnd;
        return url + testament + urlEnd;
      }
    }
  }
}
