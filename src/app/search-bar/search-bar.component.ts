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
  Omega = '\u03A9';
  searchBox = document.getElementById('searchBox') as HTMLInputElement;
  // wTags = document.querySelectorAll('w');
  constructor(private chapterService: ChapterService) {}

  ngOnInit() {}
  ngOnChanges() {}

  onKeyUp(e: KeyboardEvent) {
    // console.log(e);
    // if (this.searchText[0] !== this.Omega) {
    //   this.searchText = this.Omega + this.searchText;
    // }
    this.searchText = this.denormalizeSearchText();
    // this.searchTextChange('forward');
    if (e.keyCode === 13) {
      this.searchTextChange('forward');
    }
  }

  searchTextChange(direction: string) {
    if (this.searchText.trim().length <= 0) {
      this.clearSearch();
    } else {
      switch (direction) {
        case 'forward': {
          ipcRenderer.sendSync('search-forward', this.normalizeSearchText());
          break;
        }
        case 'back': {
          ipcRenderer.sendSync('search-back', this.normalizeSearchText());
          break;
        }
        default: {
          this.clearSearch();
          break;
        }
      }
      console.log(); // prints "pong"
    }
    // this.searchBox.focus();
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

  denormalizeSearchText(): string {
    return this.searchText
      .replace('o', '\u03BF')
      .replace('O', '\u039f')
      .replace('A', '\u0391')
      .replace('a', '\u03B1')
      .replace('e', '\u0065')
      .replace('a', '\u03B1');
  }
  normalizeSearchText(): string {
    return this.searchText
      .replace('\u03BF', 'o')
      .replace('\u039f', 'O')
      .replace('\u0391', 'A')
      .replace('\u03B1', 'a')
      .replace('\u0065', 'e')
      .replace('\u03B1', 'a');
  }

  clearSearch(): void {
    this.searchText = '';
    ipcRenderer.sendSync('search-clear', 'ping');
  }
}
