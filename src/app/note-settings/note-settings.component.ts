import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { VerseSelectService } from '../services/verse-select.service';

@Component({
  selector: 'app-note-settings',
  templateUrl: './note-settings.component.html',
  styleUrls: ['./note-settings.component.scss'],
})
export class NoteSettingsComponent implements OnInit {
  versionNumber = '';
  constructor(
    public saveState: SaveStateService,
    public navServices: NavigationService,
    public verseSelectService: VerseSelectService,
    private router: Router,
    public dataService: DataService,
    public chapterService: ChapterService,
    public httpClient: HttpClient,
  ) {}

  ngOnInit() {
    this.httpClient
      .get('assets/version.txt', { observe: 'body', responseType: 'text' })
      .subscribe(data => {
        const regex = new RegExp(/\d(\.\d{1,3}){1,2}/);
        this.versionNumber = regex.exec(data)[0];
        console.log('data ' + this.versionNumber);
      });
  }

  editPage(): void {
    console.log(this.router.url);

    if (this.router.url.includes('edit')) {
      const saveData = JSON.stringify(this.dataService.chapter2);

      // this.httpClient.put()
      this.httpClient.post(this.chapterService.url, saveData);

      // this.router.navigateByUrl(this.router.url.replace('/edit', ''));
    } else {
      this.router.navigateByUrl(`${this.router.url}/edit`);
    }
  }

  btnSecondaryNotesPress() {
    this.navServices.btnSecondaryNotesPress().then((value: boolean) => {
      console.log('asdfiojkasofjafjaosdfjoiasdfjioj');

      // this.chapterService.resetNotes();
      this.verseSelectService.resetVisibility();
    });
  }

  btnOriginalNotesPress(): void {
    this.navServices.btnOriginalNotesPress().then((value: boolean) => {
      this.verseSelectService.resetVisibility();
    });
  }
  btnTranslatorNotesPress(): void {
    this.navServices.btnTranslatorNotesPress().then((value: boolean) => {
      this.verseSelectService.resetVisibility();
    });
  }
  btnEnglishNotesPress(): void {
    this.navServices.btnEnglishNotesPress().then((value: boolean) => {
      this.verseSelectService.resetVisibility();
    });
  }
  btnNewNotesPress() {
    this.navServices.btnNewNotesPress().then((value: boolean) => {
      console.log(value);

      this.verseSelectService.resetVisibility();
    });
  }
  toggleVerseSelect() {
    this.verseSelectService.toggleVerseSuperScripts(false);
    this.verseSelectService.toggleVerseSelect();
  }
  toggleVerseSuperScripts() {
    this.verseSelectService.toggleVerseSelect(false);
    this.verseSelectService.toggleVerseSuperScripts();
  }
  settings() {
    this.router.navigateByUrl('settings');
  }

  subNotesClick(ref: string) {
    switch (ref) {
      case 'QUO': {
        this.saveState.data.refQUO = !this.saveState.data.refQUO;
        break;
      }
      case 'PHR': {
        this.saveState.data.refPHR = !this.saveState.data.refPHR;
        break;
      }
      case 'OR': {
        this.saveState.data.refOR = !this.saveState.data.refOR;
        break;
      }
      case 'IE': {
        this.saveState.data.refIE = !this.saveState.data.refIE;
        break;
      }
      case 'HEB': {
        this.saveState.data.refHEB = !this.saveState.data.refHEB;
        break;
      }
      case 'GR': {
        this.saveState.data.refGR = !this.saveState.data.refGR;
        break;
      }
      case 'KJV': {
        this.saveState.data.refKJV = !this.saveState.data.refKJV;
        break;
      }
      case 'HST': {
        this.saveState.data.refHST = !this.saveState.data.refHST;
        break;
      }
      case 'CR': {
        this.saveState.data.refCR = !this.saveState.data.refCR;
        break;
      }
      case 'ALT': {
        this.saveState.data.refALT = !this.saveState.data.refALT;
        break;
      }
      case 'HMY': {
        this.saveState.data.refHMY = !this.saveState.data.refHMY;
        break;
      }
      case 'TG': {
        this.saveState.data.refTG = !this.saveState.data.refTG;
        break;
      }
      case 'GS': {
        this.saveState.data.refGS = !this.saveState.data.refGS;
        break;
      }
    }
    this.saveState.save();

    this.verseSelectService.resetVisibility();
  }
}
