import fse from 'fs-extra';
import path from 'path';

export class FileManager {
  //   private files: string[] = [];
  //   private path = require('path');
  //   private fs = require('fs-extra');
  private fs: fse;
  // private asdf = require('path');

  public importFiles(basePath: string): void {
    // console.log(
    //   'test: ' + this.fs.lstatSync(asdf.join('' + basePath)).isDirectory()
    // );
    // this.fs.readdir(basePath, (err, items: string[]) => {
    //   items.forEach(file => {
    //     const newPath = path.join(basePath, file);
    //     console.log('fileName: ' + file);
    //     const isDirectory = this.fs.lstatSync(newPath).isDirectory();
    //     switch (isDirectory) {
    //       case true: {
    //         this.importFiles(newPath);
    //         break;
    //       }
    //       case false:
    //       default: {
    //       }
    //     }
    //   });
    // });
  }
}
