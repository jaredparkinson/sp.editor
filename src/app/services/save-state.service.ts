import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { filter, find, isEmpty, sortBy } from 'lodash';
import * as lunr from 'lunr';
import * as sqlJS from 'sql.js';
import { ISaveStateItem } from '../models/ISaveStateItem';
import { SaveStateItem } from '../models/SaveStateItem';
import { Navigation } from '../modelsJson/Navigation';
import { ReferenceLabel } from '../modelsJson/ReferenceLabel';
import { DatabaseService } from './database.service';
import { NavigationLoaderService } from './navigation-loader.service';
import { NavigationService } from './navigation.service';
import { SaveStateModel } from './SaveStateModel';
import { SearchService } from './search.service';
@Injectable({
  providedIn: 'root',
})
export class SaveStateService {
  public data: SaveStateModel;
  public flatNavigation: Navigation[] = [];
  public id: string;

  public navigation: Navigation[] = [];
  constructor(
    private databaseService: DatabaseService,
    private searchService: SearchService,
  ) {
    this.id = 'spEditorSaveState';
  }

  public flattenNavigation(
    navigation: Navigation[],
    parentNavigation: Navigation,
  ) {
    if (parentNavigation.navigation) {
      parentNavigation.navigation.forEach(nav => {
        this.flattenNavigation(navigation, nav);
      });
    } else {
      navigation.push(parentNavigation);
    }
  }
  public initISaveStateItems(): void {
    if (!this.data.navigationPaneToggle) {
      this.data.navigationPaneToggle = new SaveStateItem();
      this.setSaveStateItemDefaults(this.data.navigationPaneToggle, true);
    }
    if (!this.data.notesPanePin) {
      this.data.notesPanePin = new SaveStateItem();
      this.setSaveStateItemDefaults(this.data.notesPanePin, true);
    }
  }
  public async load(): Promise<any> {
    console.log('settings load');
    await this.databaseService.setDatabases();

    // await this.loadVerseData();
    // await this.loadSearch();
    const temp = this.getSaveState();
    this.data = temp !== null ? temp : new SaveStateModel();
    this.data.leftPaneToggle = false;
    this.data.rightPaneToggle = false;
    this.data.language = 'eng';

    if (!this.data.fontSize) {
      this.data.fontSize = '16';
    }
    if (!this.data.lineHeight) {
      this.data.lineHeight = '20';
    }

    this.initISaveStateItems();
    this.resetSettings();

    await this.setCategories();

    await this.loadNavigation();
  }
  public async loadNavigation() {
    const data = await axios.get('assets/nav/nav_rev.json');
    this.navigation = data.data as Navigation[];
    this.navigation.forEach(nav => {
      this.flattenNavigation(this.flatNavigation, nav);
    });
  }

  public loadVerseData() {
    // return new Promise(async resolve => {
    //   const promises = [];
    //   const allDocs = await this.databaseService.db.allDocs();
    //   const filteredDocs = allDocs.rows.filter(doc => {
    //     return doc.id.includes('verses');
    //   });
    //   this.searchService.verses = [];
    //   filteredDocs.forEach(async doc => {
    //     promises.push(() => {
    //       new Promise(async resolve2 => {
    //         const value = await this.databaseService.db.get(doc.id);
    //         console.log(value);
    //         this.searchService.verses = this.searchService.verses.concat(
    //           (value as any).data,
    //         );
    //         console.log(this.searchService.verses.length);
    //         resolve2();
    //       });
    //     });
    //   });
    //   Promise.all(promises).then(() => {
    //     console.log(this.searchService.verses.length);
    //     resolve();
    //   });
    // });
  }
  public resetSettings(): void {
    if (
      window.matchMedia(
        `screen and (max-width: 499.98px), (orientation: portrait) and (max-width: 1023.98px)`,
      ).matches
    ) {
      this.data.navigationPaneToggle.value = false;
    }
  }
  public save(): void {
    setTimeout(() => {
      localStorage.setItem(this.id, JSON.stringify(this.data));
    }, 100);
  }

  public async setCategories() {
    const data = await axios.get('assets/categories.json');

    if (!this.data.noteCategories) {
      this.data.noteCategories = [];
    }
    const categories = data.data as ReferenceLabel[];
    categories.forEach(category => {
      const filteredCategories = filter(this.data.noteCategories, c => {
        return c.refLabelName === category.refLabelName;
      });

      if (isEmpty(filteredCategories)) {
        this.data.noteCategories.push(category);
      }
    });
    console.log(
      this.data.noteCategories.sort((a, b) => {
        if (a.refLabelName > b.refLabelName) {
          return 1;
        }
        if (a.refLabelName < b.refLabelName) {
          return -1;
        }
        return 0;
      }),
    );

    sortBy(this.data.noteCategories, f => {
      return f.refLabelName;
    });
  }
  private getSaveState() {
    try {
      const data = localStorage.getItem(this.id);
      return JSON.parse(data) as SaveStateModel;
    } catch (error) {
      return null;
    }
  }
  private loadSearch() {}
  private setSaveStateItemDefaults<T>(
    saveSateItem: ISaveStateItem<T>,
    value: T,
  ) {
    saveSateItem.animated = false;
    saveSateItem.value = value;
  }
}
