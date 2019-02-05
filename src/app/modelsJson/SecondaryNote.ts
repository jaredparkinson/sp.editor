export class SecondaryNote {
  public cn = '';
  public id = '';
  // public id2: string = '';
  // public iH: string = '';
  public t2 = '';
  // public seNote: Array<[string, string, string, string]> = [];
  public notePhrase: NotePhrase;
  public noteRefs: NoteRef[] = [];
  public disabled = false;

  // constructor(element: Element) {
  //   this.className = element.className;
  //   this.id = element.id;
  //   this.innerHtml = element.innerHTML.replace(/\n(\t){1,10}/g, '');
  // }
}

export class NotePhrase {
  //   public id: string;
  public classList: string[] = [];
  public superscripts: string;
  public text: string;
  public visible = true;
}
export class NoteRef {
  public id: string;
  public classList: string[] = [];
  //   public superscripts: string[] = [];  public visible: boolean = true;

  public text: string;
  public visible = true;
}
