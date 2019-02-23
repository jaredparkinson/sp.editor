export class Chapter2 {
  public _id = '';
  public language = '';
  public testament = '';

  public title = '';
  public header: string;
  // public oldNotes: OldNote[] = [];
  public notes: Notes;
  public verses: Verses;
  public _rev = '';
}

export class Note {
  public id: string;
  public noteTitle: string;
  public noteShortTitle: string;
  public secondary: SecondaryNote[] = [];
}

export class NotePhrase {
  public id: string;
  public classList: string[] = [];
  public text: string;
  constructor(element: Element) {
    this.id = element.id;
    this.classList = element.className ? element.className.split(' ') : [];
    this.text = element.textContent;
  }
}

export class NoteRef {
  public id: string;
  public classList: string[] = [];
  public text: string;
  public referenceLabel: ReferenceLabel;
}

export class Notes {
  public notes: Note[] = [];
}
export class ReferenceLabel {
  public refLabelName: string;
  public refLabelShortName: string;
}

export class SecondaryNote {
  public id: string;
  public classList: string[] = [];
  public notePhrase: NotePhrase;
  public noteRefs: NoteRef[] = [];
  public noteMarker: string;
  public verseMarker: string;
  public isTier2: boolean = undefined;
}

export class Verse {
  public id: string;
  public text: string;
  public wTags: W[] = [];
  public builtWTags: W[] = [];
  public highlight: boolean = false;
  public context: boolean = false;
  constructor(element: Element) {
    this.id = element.id;
    this.text = element.textContent;

    // element.querySelectorAll('.verz=se')
  }
}
export class Verses {
  public verses: Verse[] = [];
  private count = 0;
}
export class W {
  public id: number[] = [];
  public classList: string[] = [];
  public refs: string[] = [];
  public visibleRefs: string[] = [];
  public char: string;
  public text: string = '';

  constructor(text: string) {
    this.text = text;
  }
}
