export class Overlay {
  public top: number;
  public height: '20px';

  constructor(top: number) {
    this.top = 54 + top * 20;
  }
}
