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

  searchTestChange() {
    console.log(ipcRenderer.sendSync('synchronous-message', this.searchText)); // prints "pong"
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
}
