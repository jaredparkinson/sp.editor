import { Injectable } from '@angular/core';
import * as lodash from 'lodash';
import { Paragraph } from '../modelsJson/Paragraph';
import { TemplateGroup } from '../modelsJson/TemplateGroup';
import { Verse } from '../modelsJson/Verse';
import { W2 } from '../modelsJson/W2';
import { EditService } from './EditService';
import { SaveStateService } from './save-state.service';
import { VerseSelectService } from './verse-select.service';

@Injectable({
  providedIn: 'root',
})
export class WTagService {
  constructor(
    public dataService: EditService,
    public saveState: SaveStateService,
    public verseSelectService: VerseSelectService,
  ) {}

  public buildWTags(): Promise<void> {
    return new Promise<void>(
      (
        resolve: (resolveValue: void) => void,
        reject: (rejectValue: void) => void,
      ) => {
        if (this.dataService.chapter2.paragraphs.length === 0) {
          reject(undefined);
        } else {
          this.dataService.chapter2.paragraphs.forEach(
            (pararaph: Paragraph) => {
              pararaph.verses.forEach(verse => {
                verse.wTagGroups = this.getTemplateGroups(verse);
              });
            },
          );
          resolve(undefined);
        }
      },
    );
  }

  public getTemplateGroups(verse: Verse): TemplateGroup[] {
    const templateGroups: TemplateGroup[] = [];
    let tempTemplateGroup: TemplateGroup = new TemplateGroup();

    for (let x = 0; x < Array.from(verse.text).length; x++) {
      const t = verse.text[x];

      tempTemplateGroup.text = `${tempTemplateGroup.text}${t}`;

      if (verse.w2[x]) {
        tempTemplateGroup.isWTag = true;
        tempTemplateGroup.classList = verse.w2[x].classList;
        tempTemplateGroup.refs = verse.w2[x].classList;
      }

      if (
        x + 1 === verse.text.length ||
        !this.isPartOfGroup(verse.w2[x], verse.w2[x + 1])
      ) {
        templateGroups.push(tempTemplateGroup);
        tempTemplateGroup = new TemplateGroup();
      }
    }

    // console.log(templateGroups);

    return templateGroups;
  }
  isPartOfGroup(w1: W2, w2: W2): boolean {
    if (w1 === w2) {
      return true;
    } else {
      if (!w1 || !w2) {
        return false;
      } else if (
        lodash.isEqual(w1.classList, w2.classList) &&
        lodash.isEqual(w1.refs, w2.refs)
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  public wTagClick(verse: Verse, w: TemplateGroup): void {
    this.saveState.data.notesPopover = true;

    // this.verseSelectService.wTagClick(w, verse);
  }
}
