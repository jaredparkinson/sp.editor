export class SaveStateModel implements ISaveModel {
  id = '';
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
  public backtrack: string[] = [];
  public forward: string[] = [];
  public currentPage = '';
  public verseSelect = false;
  public verseSuperScripts = false;
  constructor() {}
}

export interface ISaveModel {
  id: string;
}
