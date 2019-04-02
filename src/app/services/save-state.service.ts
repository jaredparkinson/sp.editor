import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, find, isEmpty, sortBy } from 'lodash';
import * as lunr from 'lunr';
import { ISaveStateItem } from '../models/ISaveStateItem';
import { SaveStateItem } from '../models/SaveStateItem';
import { ReferenceLabel } from '../modelsJson/ReferenceLabel';
import { DatabaseService } from './database.service';
import { SaveStateModel } from './SaveStateModel';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root',
})
export class SaveStateService {
  public data: SaveStateModel;
  public id: string;

  constructor(
    private httpClient: HttpClient,
    private databaseService: DatabaseService,
    private searchService: SearchService,
  ) {
    this.id = 'spEditorSaveState';
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
  public load(): Promise<any> {
    return new Promise(async resolve => {
      await this.loadSearch();
      await this.loadVerseData();
      console.log('settings load');

      const temp = JSON.parse(localStorage.getItem(this.id)) as SaveStateModel;
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

      this.setCategories();

      resolve();
    });
  }
  public loadVerseData() {
    return new Promise(async resolve => {
      const promises = [];

      const allDocs = await this.databaseService.db.allDocs();
      const filteredDocs = allDocs.rows.filter(doc => {
        return doc.id.includes('verses');
      });

      this.searchService.verses = [];
      // const promises = [];
      filteredDocs.forEach(async doc => {
        promises.push(() => {
          new Promise(async resolve2 => {
            const value = await this.databaseService.db.get(doc.id);

            console.log(value);

            this.searchService.verses = this.searchService.verses.concat(
              (value as any).data,
            );
            console.log(this.searchService.verses.length);
            resolve2();
          });
        });
      });

      Promise.all(promises).then(() => {
        console.log(this.searchService.verses.length);
        resolve();
      });
      // this.searchService.verses = t

      // this.httpClient
      //   .get('assets/data/verses.json', { responseType: 'json' })
      //   .subscribe(data => {
      //     this.searchService.verses = data as Array<{
      //       id: string;
      //       text: string;
      //     }>;
      //     resolve();
      //   });
    });
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

  public setCategories(): void {
    this.httpClient
      .get('assets/categories.json', { observe: 'body', responseType: 'json' })
      .subscribe(json => {
        if (!this.data.noteCategories) {
          this.data.noteCategories = [];
        }
        const categories = json as ReferenceLabel[];
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
      });

    sortBy(this.data.noteCategories, f => {
      return f.refLabelName;
    });
  }
  private loadSearch() {
    return new Promise(async resolve => {
      const promises = [];

      const allDocs = await this.databaseService.db.allDocs();
      const filteredDocs = allDocs.rows.filter(doc => {
        return doc.id.includes('index');
      });

      filteredDocs.forEach(async doc => {
        promises.push(
          new Promise(async resolve2 => {
            const value = await this.databaseService.db.get(doc.id);
            if ((value as any).data) {
              this.searchService.indexes.push(
                lunr.Index.load((value as any).data),
              );
            }
            resolve2();
          }),
        );
      });

      Promise.all(promises).then(() => {
        console.log(this.searchService.indexes.length);

        resolve();
      });
    });
  }
  private setSaveStateItemDefaults<T>(
    saveSateItem: ISaveStateItem<T>,
    value: T,
  ) {
    saveSateItem.animated = false;
    saveSateItem.value = value;
  }
}
