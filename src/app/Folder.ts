import { File } from './file';
import { Injectable } from '../../node_modules/@angular/core';

@Injectable()
export class Folder {
  path: string;
  Files: File[];
  Folders: Folder[];
  classList: string = this.path;
  private visible = false;

  setVisibility() {
    this.visible = !this.visible;
    console.log(this.visible);
  }
}
