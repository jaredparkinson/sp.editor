import { Component, OnInit } from '@angular/core';
import { File } from '../file';
import { FileManager } from '../filemanager';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  private baseFolder: string;
  private file: File;
  private fileManager: FileManager;

  constructor(baseFolder: string) {
    this.baseFolder = baseFolder;
    this.file = new File(this.baseFolder);
    this.fileManager = new FileManager();
  }

  ngOnInit() {
    console.log('test');
    this.fileManager.importFiles(this.baseFolder);
  }
}
