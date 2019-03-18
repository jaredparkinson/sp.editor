import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as lodash from 'lodash';
import { ISaveStateItem } from '../models/ISaveStateItem';
import { SaveStateItem } from '../models/SaveStateItem';
import { ReferenceLabel } from '../modelsJson/Chapter';
import { SaveStateModel } from './SaveStateModel';

@Injectable({
  providedIn: 'root',
})
export class SaveStateService {
  id: string;
  data: SaveStateModel;

  constructor(private httpClient: HttpClient) {
    this.id = 'spEditorSaveState';
    // this.load();
  }
  public save(): void {
    setTimeout(() => {
      localStorage.setItem(this.id, JSON.stringify(this.data));
    }, 100);
  }
  public load(): Promise<any> {
    return new Promise(resolve => {
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
  resetSettings(): void {
    // console.log(
    //   window.matchMedia(
    //     `screen and (max-width: 499.98px), (orientation: portrait) and (max-width: 1023.98px)`,
    //   ),
    // );
    if (
      window.matchMedia(
        `screen and (max-width: 499.98px), (orientation: portrait) and (max-width: 1023.98px)`,
      ).matches
    ) {
      this.data.navigationPaneToggle.value = false;
    }
  }
  initISaveStateItems(): void {
    if (!this.data.navigationPaneToggle) {
      this.data.navigationPaneToggle = new SaveStateItem();
      this.setSaveStateItemDefaults(this.data.navigationPaneToggle, true);
    }
    if (!this.data.notesPanePin) {
      this.data.notesPanePin = new SaveStateItem();
      this.setSaveStateItemDefaults(this.data.notesPanePin, true);
    }
  }
  private setSaveStateItemDefaults<T>(
    saveSateItem: ISaveStateItem<T>,
    value: T,
  ) {
    saveSateItem.animated = false;
    saveSateItem.value = value;
  }

  setCategories(): void {
    this.httpClient
      .get('assets/categories.json', { observe: 'body', responseType: 'json' })
      .subscribe(json => {
        if (!this.data.noteCategories) {
          this.data.noteCategories = [];
        }
        const categories = json as ReferenceLabel[];
        categories.forEach(category => {
          const filter = lodash.filter(this.data.noteCategories, c => {
            return c.refLabelName === category.refLabelName;
          });
          // console.log(`Filter ${filter}`);
          if (lodash.isEmpty(filter)) {
            // console.log(category);
            this.data.noteCategories.push(category);
          }
          // console.log(this.data.noteCategories); 🧧
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
    // this.data.noteCategories.sort(n =>)
    lodash.sortBy(this.data.noteCategories, f => {
      return f.refLabelName;
    });
  }
}
