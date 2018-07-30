import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveStateService {
  public foldersVisible = true;
  public leftPanePin = true;
  public paragraphsVisible = false;
  public poetryVisible = false;
  public newNotesVisible = false;
  public rightPaneToggle = false;
  public rightPanePin = true;
  public leftPaneToggle = false;
  public secondaryNotesVisible = false;
  public engNotesVisible = false;
  public translatorNotesVisible = false;
  public originalNotesVisible = false;
  public englishNotesVisible = false;
  constructor() {}
}
