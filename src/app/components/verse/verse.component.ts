import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Verse, W } from '../../modelsJson/Chapter';
import { TemplateGroup } from '../../modelsJson/TemplateGroup';
// import { Verse } from '../../modelsJson/Verse';
import { SaveStateService } from '../../services/save-state.service';
import { StringService } from '../../services/string.service';
import { VerseSelectService } from '../../services/verse-select.service';
import { WTagService } from '../../services/wtag-builder.service';

@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})
export class VerseComponent implements OnInit {
  @Input() public verse: Verse;
  constructor(
    public wTagBuilderService: WTagService,
    public saveState: SaveStateService,
    public verseSelectService: VerseSelectService,
    public stringService: StringService,
  ) {}

  @ViewChild('span') span!: ElementRef;

  ngOnInit() {}

  filterClassList(classList: string[]) {
    if (!classList) {
      return '';
    }

    return classList.toString();
  }

  wTagClick(w: W) {
    if (!w.visibleRefs || w.visibleRefs.length === 0) {
      console.log('hffd');
      return;
    }
  }
  getWColor(w: TemplateGroup) {
    // console.log(w.classList);

    if (!w.classList) {
      return '';
    }
    let wClass = w.classList.toString().replace(/\,/g, ' ');

    if (
      w.classList.includes('verse-select-1') &&
      w.classList.includes('verse-select-2')
    ) {
      console.log(wClass);
    }
    let engVis = true;
    let newVis = true;
    let tcVis = true;

    if (w.classList.includes('verse-select')) {
      if (this.saveState.data.verseSuperScripts) {
        w.refs.forEach(ref => {
          const engRegex = new RegExp(`\d{9}`);
          const newRegex = new RegExp(`\d{4}(\-\d{2}){6}`);
          const tcRegex = new RegExp(`tc.*`);

          if (this.verseSelectService.noteVisibility.get(ref)) {
            if (engRegex.exec(ref)) {
              engVis = true;
            } else if (newRegex.exec(ref)) {
              newVis = true;
            } else if (tcRegex.exec(ref)) {
              tcVis = true;
            }
          }
        });

        if (engVis) {
          wClass = this.stringService.addAttribute(wClass, 'eng-color');
        }
        if (newVis) {
          wClass = this.stringService.addAttribute(wClass, 'tc-color');
        }
        if (tcVis) {
          wClass = this.stringService.addAttribute(wClass, 'new-color');
        }
      }
    }

    return wClass;
  }

  public isTop(): Promise<[boolean, string]> {
    return new Promise<[boolean, string]>(
      (
        resolve: (resolveValue: [boolean, string]) => void,
        reject: (rejectValue: [boolean, string]) => void,
      ) => {
        this.getBoundingClientRect()
          .then(value => {
            const start = 35;
            if (value[0] >= 33) {
              const noteID = `note${this.verse.id.substr(
                1,
                this.verse.id.length,
              )}`;
              // console.log(`${value[0]} ${value[1]} ${noteID}`);
              resolve([true, noteID]);
            } else {
              resolve(null);
            }
          })
          .catch(() => {
            reject(null);
          });
      },
    );
  }

  public getBoundingClientRect(): Promise<[number, number]> {
    return new Promise<[number, number]>(
      (
        resolve: (resolveValue: [number, number]) => void,
        reject: (rejectValue: [number, number]) => void,
      ) => {
        if (this.span) {
          const clientRect = (this.span
            .nativeElement as HTMLElement).getBoundingClientRect();
          resolve([clientRect.top, clientRect.height]);
        } else {
          reject(null);
        }
      },
    );
  }
}
