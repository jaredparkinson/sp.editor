import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../../modelsJson/Note';
import { ChapterService } from '../../services/chapter.service';
import { SyncScrollingService } from '../../services/sync-scrolling.service';
import { DataService } from '../../services/data.service';
import { SecondaryNote } from '../../modelsJson/SecondaryNote';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  @Input() public note: Note;
  constructor(
    public chapterService: ChapterService,
    public syncScrollingService: SyncScrollingService,
    public dataService: DataService,
  ) {}

  ngOnInit() {}
  filterClassList(classList: string[]): string {
    if (!classList) {
      return '';
    }

    return classList.toString();
  }
  notePhraseClick(secondaryNote: SecondaryNote) {
    console.log(secondaryNote.id);
    const clicked = secondaryNote.clicked;
    console.log(clicked);

    this.chapterService.resetNotes().then(() => {
      secondaryNote.clicked = clicked;
      if (clicked) {
        secondaryNote.clicked = false;
      } else {
        secondaryNote.clicked = true;
        this.dataService.verses.forEach(verse => {
          verse.wTags.forEach(wTag => {
            wTag.selected = wTag.refs && wTag.refs.includes(secondaryNote.id);
            // if (wTag.refs && wTag.refs.includes(secondaryNote.id)) {
            //   wTag.selected = true;
            // } else {
            //   wTag.selected = false;
            // }
          });
        });
      }
    });
  }
}
