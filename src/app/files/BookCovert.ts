export class BookConvert {
  public names: string[];
  public convertTo: string;
  constructor(names: string[]) {
    this.convertTo = names[names.length - 1];
    // if (names.length !== 1) {
    //   names.pop();
    // }
    this.names = names;

    // console.log(this.names);
  }
}
