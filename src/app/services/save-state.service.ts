import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as lodash from 'lodash';
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
    localStorage.setItem(this.id, JSON.stringify(this.data));
  }
  public load(): Promise<any> {
    return new Promise(resolve => {
      const temp = JSON.parse(localStorage.getItem(this.id)) as SaveStateModel;
      this.data = temp !== null ? temp : new SaveStateModel();
      this.data.leftPaneToggle = false;
      this.data.rightPaneToggle = false;
      this.data.language = 'eng';
      this.setCategories();

      resolve();
    });
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
