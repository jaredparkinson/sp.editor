import { File } from './file';
export class Folder {
  path: string;
  Files: File[];
  Folders: Folder[];
}
