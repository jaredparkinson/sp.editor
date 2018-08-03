import { Injectable } from '@angular/core';
import { SaveStateModel } from './SaveStateModel';
import { SaveStateTemplate } from './SaveStateTemplate';

@Injectable({
  providedIn: 'root'
})
export class SaveStateService {
  id: string;
  data: SaveStateModel;

  constructor() {
    this.id = 'spEditorSaveState';
    this.load();
  }
  public save(): void {
    localStorage.setItem(this.id, JSON.stringify(this.data));
  }
  public load(): void {
    const temp = JSON.parse(localStorage.getItem(this.id)) as SaveStateModel;
    if (temp !== null) {
      this.data = temp;
    } else {
      this.data = new SaveStateModel();
    }
  }
}
