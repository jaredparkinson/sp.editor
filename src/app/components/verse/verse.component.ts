import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as lodash from 'lodash';
import { Verse, W } from '../../modelsJson/Chapter';
import { TemplateGroup } from '../../modelsJson/TemplateGroup';
import { ChapterService } from '../../services/chapter.service';
import { DataService } from '../../services/data.service';
import { EditService } from '../../services/EditService';
// import { Verse } from '../../modelsJson/Verse';
import { SaveStateService } from '../../services/save-state.service';
import { StringService } from '../../services/string.service';
import { VerseSelectService } from '../../services/verse-select.service';
import { WTagService } from '../../services/wtag-builder.service';
@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerseComponent implements OnInit {
  @Input() public verse: Verse;
  constructor(
    public wTagBuilderService: WTagService,
    public saveState: SaveStateService,
    public verseSelectService: VerseSelectService,
    public stringService: StringService,
    public chapterService: ChapterService,
    public dataService: DataService,
  ) {}

  @ViewChild('span') span!: ElementRef;

  ngOnInit() {}

  filterClassList(classList: string[]) {
    if (!classList) {
      return '';
    }

    return classList.toString().replace(',', ' ');
  }

  wTagClick(w: W) {
    if (!w.visibleRefs) {
      return;
    }

    if (lodash.isEmpty(w.visibleRefs)) {
      this.chapterService.resetNotes();
    } else {
      if (w.clicked) {
        this.wTagSelect(w);
      } else {
        this.chapterService.resetNotes().then(() => {
          w.clicked = true;

          this.wTagSelect(w);
        });
      }
    }
    // console.log(w.visibleRefs);
  }

  private wTagSelect(w: W) {
    return new Promise<void>(resolve => {
      const ref = w.visibleRefs.pop();
      w.selected = true;
      this.dataService.verses.forEach(verse => {
        verse.wTags.forEach(wTag => {
          if (wTag.visibleRefs && wTag.visibleRefs.includes(ref)) {
            wTag.selected = true;
          }
        });
      });

      this.dataService.chapter2.notes.forEach(note => {
        note.secondary.forEach(secondaryNote => {
          secondaryNote.clicked = secondaryNote.id === ref;
        });
      });

      this.saveState.data.rightPanePin = true;

      if (ref) {
        document.getElementById(ref).scrollIntoView();
      }
      resolve();
    });
  }

  private resetNotes(): Promise<void> {
    return new Promise<void>(resolve => {
      this.chapterService
        .resetNoteVisibility(
          this.dataService.chapter2,
          this.dataService.noteVisibility,
        )
        .then(() => {
          this.chapterService
            .buildWTags(
              this.dataService.verses,
              this.dataService.noteVisibility,
            )
            .then(() => {
              resolve();
            });
        });
    });
  }
}
