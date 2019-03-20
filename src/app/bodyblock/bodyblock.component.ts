import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bowser from 'bowser';
import * as lodash from 'lodash';

import { DomSanitizer } from '@angular/platform-browser';

import { VerseComponent } from '../components/verse/verse.component';

import { Navigation } from '../modelsJson/Navigation';
import { Verse } from '../modelsJson/Verse';
import { ChapterService } from '../services/chapter.service';
import { DataService } from '../services/data.service';
import { EditService } from '../services/EditService';
import { MediaQueryService } from '../services/media-query.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { StringService } from '../services/string.service';
import { SyncScrollingService } from '../services/sync-scrolling.service';
// import { VerseSelectService } from '../services/verse-select.service';
import { WTagService } from '../services/wtag-builder.service';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss'],
})
export class BodyblockComponent implements OnInit, OnDestroy {
  isIOS = false;
  chapterFadeOut = false;
  swipeRight = false;
  url: string;
  constructor(
    public fileManager: NavigationService,
    public httpClient: HttpClient,
    public sanitizer: DomSanitizer,
    public chapterService: ChapterService,
    public editService: EditService,
    public navService: NavigationService,
    public saveState: SaveStateService,
    public stringService: StringService,
    public mediaQueryService: MediaQueryService,
    // public verseSelectService: VerseSelectService,
    private route: ActivatedRoute,
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
      this.closeNavigation();
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

      this.url = `${book}/${lodash.last(highlighting)}`;
      const id = `${book}-${highlighting.pop()}-${language}`;

      this.getChapter(id, highlighting).then(async v => {
        // this.swipeRight = false;
        this.chapterService.chapterFadeOut = false;
        this.scrollToVerse(v);
        await this.resetNavigationFocus(this.navService.navigation);
        this.setNavigation(this.navService.navigation);
      });
    });
  }
  resetNavigationFocus(navigation: Navigation[]): Promise<void> {
    return new Promise<void>(resolve => {
      navigation.forEach(async nav => {
        if (nav.url) {
          nav.focus = false;
        } else {
          await this.resetNavigationFocus(nav.navigation);
        }
      });
      resolve();
    });
  }
  closeNavigation(): void {
    if (
      this.saveState.data.navigationPaneToggle.value &&
      this.mediaQueryService.isSmallScreen()
    ) {
      this.navService.btnHeaderButtonPress(
        this.saveState.data.navigationPaneToggle,
      );
    }
  }
  setNavigation(navigation: Navigation[]) {
    let isNav = false;

    const navLink = navigation.filter(n => {
      return n.url && n.url === this.url;
    });
    if (navLink.length > 0) {
      navLink[0].focus = true;
      navigation.forEach(n => {
        n.hide = false;
        if (n !== navLink[0]) {
          n.focus = false;
        }
      });
      isNav = true;
    } else {
      navigation.forEach(n => {
        n.focus = false;
        if (!n.url) {
          if (this.setNavigation(n.navigation)) {
            n.hide = false;
            n.subNavigationVisible = true;
            isNav = true;
          } else {
            n.hide = true;
            n.subNavigationVisible = false;
          }

          // n.hide = !this.setNavigation(n.navigation);
        } else {
          n.hide = true;
        }
      });
    }

    return isNav;
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

      resolve(v);
    });
  }

  public swipeChapter(event: Event, url: string) {
    console.log(event);

    if ((event as PointerEvent).pointerType === 'touch') {
      this.chapterService.chapterFadeOut = true;
      // if (event.type === 'swiperight') {
      //   // console.log(event);
      //   this.fadeOut = true;
      // }
      // if (event.type === 'swipeleft') {
      //   this.swipeRight = true;
      //   // console.log(event);
      // }
      setTimeout(() => {
        this.router.navigateByUrl(url);
      }, 150);
    }
  }

  public onPan(event: Event) {
    console.log(event);
  }

  public stringSplit(text: string): string[] {
    return Array.from(text);
  }

  trackById(paragraph: any) {
    return paragraph.id;
  }

  onScroll() {
    this.syncScrollingService.onScroll();
  }

  synchronizedScrolling(): void {}
}
