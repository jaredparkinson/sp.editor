export class SecondaryNote {
  public cn: string = '';
  public id: string = '';
  public iH: string = '';
  public t2: string = '';

  constructor(element: Element) {
    this.className = element.className;
    this.id = element.id;
    this.innerHtml = element.innerHTML.replace(/\n(\t){1,10}/g, '');
  }
}
