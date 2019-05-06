import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isEmpty } from 'lodash';
import { scrollIntoView } from '../../../HtmlFunc';

import { Verse, W } from 'oith.models/dist';
import { ChapterService } from '../../services/chapter.service';
import { DataService } from '../../services/data.service';
//
import { SaveStateService } from '../../services/save-state.service';
import { StringService } from '../../services/string.service';
// import { VerseSelectService } from '../../services/verse-select.service';
import { WTagService } from '../../services/wtag-builder.service';
@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerseComponent implements OnInit {
  @ViewChild('span') public span!: ElementRef;
  @Input() public verse: Verse;
  public constructor(
    public wTagService: WTagService,
    public saveState: SaveStateService,
    // public verseSelectService: VerseSelectService,
    public sanitizer: DomSanitizer,
    public stringService: StringService,
    public chapterService: ChapterService,
    public dataService: DataService,
  ) {}
  public async animateNotesPane(): Promise<void> {
    if (!this.saveState.data.notesPanePin.value) {
      this.saveState.data.notesPanePin.value = true;

      this.saveState.data.notesPanePin.animated = true;
      setTimeout((): void => {
        this.saveState.data.notesPanePin.animated = false;
        // resolve();
      }, 400);
    }
  }
  public filterClassList(classList: string[]): string {
    if (!classList) {
      return '';
    }
    // if()

    return classList.toString().replace(/\,/g, ' ');
  }

  public ngOnInit(): void {}
  public resetCloneRange(): void {
    this.wTagService.reset();
  }

  public wTagClick(w: W): void {
    if (!w.visibleRefs) {
      return;
    }

    if (isEmpty(w.visibleRefs)) {
      this.chapterService.resetNotes();
    } else {
      if (w.clicked) {
        this.wTagSelect(w);
      } else {
        this.chapterService.resetNotes().then(
          (): void => {
            w.clicked = true;

            this.wTagSelect(w);
          },
        );
      }
    }
    // console.log(w.visibleRefs);
  }

  private async wTagSelect(w: W): Promise<void> {
    const ref = w.visibleRefs.pop();
    w.selected = true;
    this.dataService.verses.forEach(
      (verse): void => {
        verse.wTags.forEach(wTag => {
          if (ref && wTag.visibleRefs && wTag.visibleRefs.includes(ref)) {
            wTag.selected = true;
          }
        });
      },
    );

    this.dataService.baseChapter.notes.forEach(
      (note): void => {
        note.secondary.forEach(secondaryNote => {
          secondaryNote.clicked = secondaryNote.id === ref;
        });
      },
    );

    await this.animateNotesPane();
    scrollIntoView(`#${ref}`);
  }
}
