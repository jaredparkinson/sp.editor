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
  alphabet = [
    // '\uFF10',
    // '0',
    // '\uFF11',
    // '1',
    // '\uFF12',
    // '2',
    // '\uFF13',
    // '3',
    // '\uFF14',
    // '4',
    // '\uFF15',
    // '5',
    // '\uFF16',
    // '6',
    // '\uFF17',
    // '7',
    // '\uFF18',
    // '8',
    // '\uFF19',
    // '9',
    '\u0410',
    'A',
    '\u0412',
    'B',
    '\u0421',
    'C',
    // '\uFF24',
    // 'D',
    '\u0415',
    'E',
    // '\uFF26',
    // 'F',
    '\u050C',
    'G',
    '\u041D',
    'H',
    '\u0406',
    'I',
    '\u0408',
    'J',
    // '\uFF2B',
    // 'K',
    // '\uFF2C',
    // 'L',
    '\u041C',
    'M',
    // '\uFF2E',
    // 'N',
    '\u041E',
    'O',
    '\u0420',
    'P',
    '\u051A',
    'Q',
    // '\uFF32',
    // 'R',
    '\u0405',
    'S',
    '\u0422',
    'T',
    // '\uFF35',
    // 'U',
    // '\uFF36',
    // 'V',
    '\u051C',
    'W',
    '\u0425',
    'X',
    // '\uFF39',
    // 'Y',
    // '\uFF3A',
    // 'Z',
    '\u0430',
    'a',
    // '\uFF42',
    // 'b',
    '\u0441',
    'c',
    '\u0501',
    'd',
    '\u0435',
    'e',
    // '\uFF46',
    // 'f',
    // '\uFF47',
    // 'g',
    // '\uFF48',
    // 'h',
    '\u0456',
    'i',
    '\u0458',
    'j',
    // '\uFF4B',
    // 'k',
    // '\uFF4C',
    // 'l',
    // '\uFF4D',
    // 'm',
    // '\uFF4E',
    // 'n',
    '\u043E',
    'o',
    '\u0440',
    'p',
    '\u051B',
    'q',
    // '\uFF52',
    // 'r',
    '\u0455',
    's',
    // '\uFF54',
    // 't',
    // '\uFF55',
    // 'u',
    // '\uFF56',
    // 'v',
    '\u051D',
    'w',
    '\u0445',
    'x',
    '\u0443',
    'y'
    // '\uFF5A',
    // 'z'
  ];
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
    this.denormalizeSearchText();
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
          console.log(this.normalizeSearchText());

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

  denormalizeSearchText(): void {
    // let temp = this.searchText;
    for (let x = 0; x < this.alphabet.length; x += 2) {
      const element = this.alphabet[x];

      this.searchText = this.searchText.replace(
        this.alphabet[x + 1],
        this.alphabet[x]
      );
    }

    // return temp;
    // return this.searchText
    //   .replace('o', '\u03BF')
    //   .replace('O', '\u039f')
    //   .replace('A', '\u0391')
    //   .replace('a', '\u03B1')
    //   .replace('e', '\u0065')
    //   .replace('G', '\uFF27')
    //   .replace('o', '\uFF4F')
    //   .replace('a', '\u03B1');
  }
  normalizeSearchText(): string {
    let temp = this.searchText;
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < this.alphabet.length; x += 2) {
        temp = temp.replace(this.alphabet[x], this.alphabet[x + 1]);
      }
    }
    // for (let x = 0; x < this.alphabet.length; x += 2) {
    //   temp = temp.replace(this.alphabet[x], this.alphabet[x + 1]);
    // }
    // temp = temp.replace('\u043E', 'o');
    return temp;
    // return this.searchText
    //   .replace('\u03BF', 'o')
    //   .replace('\u039f', 'O')
    //   .replace('\uFF27', 'G')
    //   .replace('\u0391', 'A')
    //   .replace('\u03B1', 'a')
    //   .replace('\uFF4F', 'o')
    //   .replace('\u0065', 'e')
    //   .replace('\u03B1', 'a');
  }

  clearSearch(): void {
    this.searchText = '';
    ipcRenderer.sendSync('search-clear', 'ping');
  }
}
