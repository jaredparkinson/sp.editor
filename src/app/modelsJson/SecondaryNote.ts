export class SecondaryNote {
  public cn: string = '';
  public id: string = '';

  public t2: string = 'f';
  // public seNote: [string, string, string, string][] = [];
  public notePhrase: NotePhrase;
  public noteRefs: NoteRef[] = [];
  public disabled: boolean = false;
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
