export class SecondaryNote {
  public className = '';
  public id = '';
  public innerHtml = '';

  constructor(element: Element) {
    this.className = element.className;
    this.id = element.id;
    this.innerHtml = element.innerHTML.replace(/\n(\t){1,10}/g, '');
  }
}
