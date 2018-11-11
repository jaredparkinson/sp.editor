import { Injectable } from '@angular/core';
import { SaveStateModel } from './SaveStateModel';

@Injectable({
  providedIn: 'root'
})
export class SaveStateService {
  id: string;
  data: SaveStateModel;

  constructor() {
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
      resolve();
    });
  }
}
