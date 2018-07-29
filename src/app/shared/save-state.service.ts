import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveStateService {
  public foldersVisible = true;
  public leftPanePin = true;
  public rightPanePin = true;
  public paragraphsVisible = false;
  public secondaryNotesVisible = false;
  public engNotesVisible = false;
  public translatorNotesVisible = false;
  public newNotesVisible = false;
  constructor() {}
}
