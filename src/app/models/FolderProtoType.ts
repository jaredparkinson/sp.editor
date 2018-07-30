import { File } from './file';
export class FolderProtoType {
  path: string;
  Files: File[];
  Folders: FolderProtoType[];
}
