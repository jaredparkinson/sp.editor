import { HttpClient } from '@angular/common/http';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { VerseComponent } from '../components/verse/verse.component';
import { TemplateGroup } from '../modelsJson/TemplateGroup';
import { Verse } from '../modelsJson/Verse';
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
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss'],
})
export class BodyblockComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
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
    private swUpdate: SwUpdate,
  ) {
    this.swUpdate.available.subscribe(evt => {
      alert('App Update is Avaliable');
    });
  }
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  @ViewChildren('verses')
  verses!: QueryList<VerseComponent>;
  private pageId = '';

  ngAfterContentInit(): void {}
  ngOnDestroy() {}
  ngOnInit() {
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

      this.getChapter(id, highlighting).then(() => {
        console.log(`highlight ${highlighting}`);
      });
    });
  }

  private getChapter(id: string, highlighting: string[] = []) {
    return new Promise(async resolve => {
      let chapter = this.dataService.chapter2;
      if (this.pageId !== id) {
        chapter = await this.chapterService.getChapter(id);
        this.dataService.paragraphs = lodash.cloneDeep(chapter.paragraphs);
        this.dataService.verses = lodash.cloneDeep(chapter.verses);
      }
      this.pageId = id;
      // .then(async chapter => {
      //   console.log(chapter);

      const v = await this.chapterService.setHighlightging(
        this.dataService.verses,
        [highlighting.pop(), highlighting.pop()],
      );
      // .then(async chapter => {
      await this.chapterService.resetNoteVisibility(
        chapter,
        this.dataService.noteVisibility,
      );
      // .then(() => {
      //   console.log('test1');

      await this.chapterService.buildWTags(
        this.dataService.verses,
        this.dataService.noteVisibility,
      );
      // .then(() => {
      //   console.log('test2');

      await this.chapterService.buildParagraphs(
        this.dataService.paragraphs,
        this.dataService.verses,
      );
      // .then(() => {
      //   console.log('test3');

      this.dataService.chapter2 = chapter;

      if (v) {
        document.getElementById('p' + v).scrollIntoView();
      }
      // console.log(this.dataService.paragraphs);
      resolve();
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

    console.log(templateGroups);

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

  private wordSelection() {
    lodash.each(document.querySelectorAll('w'), () => {});
  }

  trackById(paragraph: any) {
    return paragraph.id;
  }

  wTagClick(wTag: W, verse: Verse, event: Event) {
    if (!this.saveState.data.rightPanePin) {
    }
    this.saveState.data.notesPopover = true;
    console.log(wTag);
    console.log((event.currentTarget as Element).getBoundingClientRect());

    this.verseSelectService.wTagClick(wTag, verse);
  }

  ngAfterViewInit() {
    console.log('ff');
  }
  onScroll() {
    this.syncScrollingService.onScroll();
  }

  synchronizedScrolling(): void {}
}
