import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ChapterService } from '../services/chapter.service';
import { BrowserView, BrowserWindow, ipcMain, ipcRenderer } from 'electron';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnChanges {
  @Input()
  searchText = '';
  // wTags = document.querySelectorAll('w');
  constructor(private chapterService: ChapterService) {}

  ngOnInit() {}
  ngOnChanges() {}

  onKeyUp(e: KeyboardEvent) {
    // console.log(e);
    if (e.keyCode === 13) {
      this.searchTestChange('forward');
    }
  }

  searchTestChange(direction: string) {
    if (this.searchText.trim().length <= 0) {
      this.clearSearch();
    } else {
      switch (direction) {
        case 'forward': {
          ipcRenderer.sendSync('search-forward', this.searchText);
          break;
        }
        case 'back': {
          ipcRenderer.sendSync('search-back', this.searchText);
          break;
        }
        default: {
          this.clearSearch();
          break;
        }
      }
      console.log(); // prints "pong"
    }
    // // console.log(this.searchText);
    // let strFound = window.find(this.searchText);
    // if (!strFound) {
    //   strFound = window.find(this.searchText, 0, 1);
    //   while (window.find(this.searchText, 0, 1)) {
    //     continue;
    //   }
    // }
    // console.log();
    // this.chapterService.notes2.forEach(note => {
    //   if (
    //     note.innerText.toLowerCase().includes(this.searchText.toLowerCase())
    //   ) {
    //     console.log(note.id);
    //   }
    // });
  }

  clearSearch(): void {
    this.searchText = '';
    ipcRenderer.sendSync('search-clear', 'ping');
  }
}
