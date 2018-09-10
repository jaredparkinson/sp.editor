import { FolderProtoType } from './FolderProtoType';

import { File } from './file';

export class Folder {
  path: string;
  files: File[];
  folders: Folder[];
  classList: string = this.path;
  visible: boolean;

  setVisibility() {
    this.visible = !this.visible;
    console.log(this.visible);
  }
}
