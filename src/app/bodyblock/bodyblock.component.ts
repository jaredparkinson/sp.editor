import { HttpClient } from '@angular/common/http';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bowser from 'bowser';
import * as lodash from 'lodash';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SwUpdate } from '@angular/service-worker';
import { VerseComponent } from '../components/verse/verse.component';
import { TemplateGroup } from '../modelsJson/TemplateGroup';

import { Verse } from '../modelsJson/Chapter';
import { W2 } from '../modelsJson/W2';
import { W } from '../modelsJson/WTag';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { EditService } from '../services/EditService';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { StringService } from '../services/string.service';
import { SyncScrollingService } from '../services/sync-scrolling.service';
import { VerseSelectService } from '../services/verse-select.service';
import { WTagService } from '../services/wtag-builder.service';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss'],
})
export class BodyblockComponent implements OnInit, OnDestroy {
  isIOS = false;
  constructor(
    public fileManager: NavigationService,
    public httpClient: HttpClient,
    public sanitizer: DomSanitizer,
    public chapterService: ChapterService,
    public editService: EditService,
    public navService: NavigationService,
    public saveState: SaveStateService,
    public stringService: StringService,
    public verseSelectService: VerseSelectService,
    private route: ActivatedRoute,
    private wTagBuilderService: WTagService,
    public syncScrollingService: SyncScrollingService,
    public dataService: DataService,
    public router: Router,
  ) {}
  v: number;
  @ViewChildren('verses')
  verses!: QueryList<VerseComponent>;
  private pageId = '';
  ngOnDestroy() {}
  ngOnInit() {
    this.isIOS =
      bowser.getParser(window.navigator.userAgent).getOSName() === 'iOS';
    this.route.params.subscribe(async params => {
      document.querySelector('.body-block').scrollIntoView();
      this.navService.rightPaneToggle = false;
      this.navService.leftPaneToggle = false;

      console.log(params);

      const book = params['book'];
      const chapter = params['chapter'].toString();
      const highlighting: string[] = chapter.split('.').reverse();
      const language = params['language']
        ? params['language']
        : this.saveState.data.language;

      console.log(language);

      const id = `${book}-${highlighting.pop()}-${language}`;

      this.getChapter(id, highlighting).then(v => {
        console.log(`highlight ${highlighting}`);

        console.log(this.dataService.chapter2._id);
        this.scrollToVerse(v);
      });
    });
  }

  private scrollToVerse(v: number) {
    setTimeout(() => {
      const selectedVerse = document.querySelector(`#p${v}`);
      if (selectedVerse) {
        selectedVerse.scrollIntoView();
      } else {
        document.querySelector('header').scrollIntoView();
      }
    });
  }

  private getChapter(id: string, highlighting: string[] = []) {
    return new Promise<number>(async resolve => {
      let chapter = this.dataService.chapter2;
      if (this.pageId !== id) {
        chapter = await this.chapterService.getChapter(id);
        this.dataService.paragraphs = lodash.cloneDeep(chapter.paragraphs);
        this.dataService.verses = lodash.cloneDeep(chapter.verses);
      }
      this.pageId = id;

      const v = await this.chapterService.setHighlightging(
        this.dataService.verses,
        [highlighting.pop(), highlighting.pop()],
      );

      await this.chapterService.resetNoteVisibility(
        chapter,
        this.dataService.noteVisibility,
      );

      await this.chapterService.buildWTags(
        this.dataService.verses,
        this.dataService.noteVisibility,
      );

      await this.chapterService.buildParagraphs(
        this.dataService.paragraphs,
        this.dataService.verses,
      );

      this.dataService.chapter2 = chapter;
      this.dataService.header = lodash.filter(
        this.dataService.verses,
        (verse: Verse) => {
          return verse.header;
        },
      );
      console.log(this.dataService.header);

      resolve(v);
    });
  }

  public stringSplit(text: string): string[] {
    return Array.from(text);
  }

  getWColor(w: TemplateGroup) {
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

  private wordSelection() {
    lodash.each(document.querySelectorAll('w'), () => {});
  }

  trackById(paragraph: any) {
    return paragraph.id;
  }

  private scrollIto() {
    const asdf = document.getElementById(`p${this.v}`);
    if (asdf) {
      console.log(asdf.scrollIntoView());
    }
  }

  onScroll() {
    this.syncScrollingService.onScroll();
  }

  synchronizedScrolling(): void {}
}
