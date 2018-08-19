import { ISaveModel } from './SaveStateModel';

export class SaveStateTemplate<T extends ISaveModel> {
  id: string;
  data: T;
  constructor() {
    // this.id = id;
  }
  public save(): void {
    localStorage.setItem(this.id, JSON.stringify(this.data));
  }
  public load(): void {
    const temp = JSON.parse(localStorage.getItem(this.id)) as T;
    if (temp !== null) {
      this.data = temp;
    } else {
      // this.data = new () => T;
      console.log(this.data);
    }
  }
}
