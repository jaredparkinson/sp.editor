import { ReferenceLabel } from '../modelsJson/Chapter';

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
  public translatorNotesVisible = true;
  public originalNotesVisible = false;
  public englishNotesVisible = false;
  public backtrack: string[] = [];
  public forward: string[] = [];
  public currentPage = '';
  public verseSelect = true;
  public verseSuperScripts = false;
  public fontSize = '16';
  public lineHeight = '20';
  // public refQUO = true;
  // public refPHR = true;
  // public refOR = true;
  // public refIE = true;
  // public refHEB = true;
  // public refGR = true;
  // public refKJV = true;
  // public refHST = true;
  // public refCR = true;
  // public refALT = true;
  // public refHMY = true;
  // public refTG = true;
  // public refGS = true;
  public notesPopover = false;
  public noteCategories: ReferenceLabel[] = [];
  public language: string;

  constructor() {}
}

export interface ISaveModel {
  id: string;
}
