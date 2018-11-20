import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { VerseSelectService } from '../services/verse-select.service';

@Component({
  selector: 'app-note-settings',
  templateUrl: './note-settings.component.html',
  styleUrls: ['./note-settings.component.scss']
})
export class NoteSettingsComponent implements OnInit {
  versionNumber = '';
  constructor(
    public saveState: SaveStateService,
    public navServices: NavigationService,
    public verseSelectService: VerseSelectService,
    private router: Router,
    public chapterService: ChapterService,
    public httpClient: HttpClient
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
  btnSecondaryNotesPress() {
    this.navServices.btnSecondaryNotesPress().then((value: boolean) => {
      console.log('asdfiojkasofjafjaosdfjoiasdfjioj');

      this.chapterService.resetNotes();
      this.chapterService.resetVerseSelect();
    });
  }
  btnOriginalNotesPress(): void {
    this.navServices.btnOriginalNotesPress().then((value: boolean) => {
      this.chapterService.resetVerseSelect();
    });
  }
  btnTranslatorNotesPress(): void {
    this.navServices.btnTranslatorNotesPress().then((value: boolean) => {
      this.chapterService.resetVerseSelect();
    });
  }
  btnEnglishNotesPress(): void {
    this.navServices.btnEnglishNotesPress().then((value: boolean) => {
      this.chapterService.resetVerseSelect();
    });
  }
  btnNewNotesPress() {
    this.navServices.btnNewNotesPress().then((value: boolean) => {
      console.log(value);

      this.chapterService.resetVerseSelect();
    });
  }
  toggleVerseSelect() {
    this.chapterService.toggleVerseSuperScripts(false);
    this.chapterService.toggleVerseSelect();
  }
  toggleVerseSuperScripts() {
    this.chapterService.toggleVerseSelect(false);
    this.chapterService.toggleVerseSuperScripts();
  }
  settings() {
    this.router.navigateByUrl('settings');
  }
}
