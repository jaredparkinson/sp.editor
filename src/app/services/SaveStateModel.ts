import { ISaveStateItem } from '../models/ISaveStateItem';
import { ReferenceLabel } from '../modelsJson/ReferenceLabel';

export class SaveStateModel implements ISaveModel {
  public backtrack: string[] = [];
  public currentPage = '';
  public englishNotesVisible = false;
  public engNotesVisible = false;
  public foldersVisible = true;
  public fontSize = '16';
  public forward: string[] = [];
  public id = '';
  public language: string;
  public leftPanePin = true;
  public leftPaneToggle = false;
  public lineHeight = '20';

  public navigationPaneToggle: ISaveStateItem<boolean>;
  public newNotesVisible = false;
  public noteCategories: ReferenceLabel[] = [];
  public notesPanePin: ISaveStateItem<boolean>;
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
  public originalNotesVisible = false;
  public paragraphsVisible = false;
  public poetryVisible = false;
  public rightPanePin = true;
  public rightPaneToggle = false;
  public secondaryNotesVisible = false;
  public translatorNotesVisible = true;
  public verseSelect = true;
  public verseSuperScripts = false;

  constructor() {}
}

export interface ISaveModel {
  id: string;
}
