import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DomSanitizer } from '@angular/platform-browser';

import { VerseComponent } from '../components/verse/verse.component';

import { cloneDeep, filter, last } from 'lodash';
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

import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Chapter2 } from '../modelsJson/Chapter';
import { DatabaseService } from '../services/database.service';
import { WTagService } from '../services/wtag-builder.service';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss'],
})
export class BodyblockComponent implements OnInit, OnDestroy {
  public chapterFadeOut = false;
  public swipeRight = false;
  public url: string;
  public v: number;
  @ViewChildren('verses')
  public verses!: QueryList<VerseComponent>;
  private pageId = '';
  private pageUrl = '';
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
    private route: ActivatedRoute,
    public syncScrollingService: SyncScrollingService,
    public dataService: DataService,
    public router: Router,
    public wTagService: WTagService,
    public databaseService: DatabaseService,
  ) {}

  public btnNavigationButtons(direction: number) {
    this.router.navigateByUrl(this.getNavigationUrl(direction));
  }
  public closeNavigation(): void {
    if (
      this.saveState.data.navigationPaneToggle.value &&
      this.mediaQueryService.isSmallScreen()
    ) {
      this.navService.btnHeaderButtonPress(
        this.saveState.data.navigationPaneToggle,
      );
    }
  }

  public getNavigationUrl(direction: number) {
    let url = '';

    for (let x = 0; x < this.saveState.flatNavigation.length; x++) {
      const element = this.saveState.flatNavigation[x];

      if (element.url === this.pageUrl) {
        if (x + direction === -1) {
          x = this.saveState.flatNavigation.length;
        } else if (x + direction === this.saveState.flatNavigation.length) {
          x = -1;
        }
        console.log(x);

        url = this.saveState.flatNavigation[x + direction].url;

        x = this.saveState.flatNavigation.length;
      }
    }
    return url;
  }

  public ngOnDestroy() {}
  public ngOnInit() {
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

      this.pageUrl = `${book}/${chapter.split('.')[0]}`;
      this.url = `${book}/${last(highlighting)}`;
      const id = `${book}-${highlighting.pop()}-${language}`;
      this.chapterService.chapterFadeOut = true;
      try {
        const v = await this.buildPage(id, highlighting);
        this.chapterService.chapterFadeOut = false;
        this.scrollToVerse(v);
        await this.setNavigation(this.saveState.navigation);
        // this.setNavigation(this.saveState.navigation);
        this.chapterService.chapterFadeOut = false;

        this.wTagService.init();
      } catch (error) {
        console.log(error);

        console.log('failed');

        this.router.navigateByUrl('/');
      }
    });
  }

  public onPan(event: Event) {
    console.log(event);
  }

  public onScroll() {
    this.syncScrollingService.onScroll();
  }
  public async resetNavigationFocus(navigation: Navigation[]): Promise<void> {
    navigation.forEach(async nav => {
      if (nav.url) {
        nav.focus = false;
      } else {
        await this.resetNavigationFocus(nav.navigation);
      }
    });
  }
  public setNavigation(navigation: Navigation[]) {
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
        } else {
          n.hide = true;
        }
      });
    }

    return isNav;
  }

  public stringSplit(text: string): string[] {
    return Array.from(text);
  }

  public swipeChapter(event: Event, direction: number) {
    const url = this.getNavigationUrl(direction);

    if ((event as PointerEvent).pointerType === 'touch') {
      this.chapterService.chapterFadeOut = true;

      setTimeout(() => {
        this.router.navigateByUrl(url);
      }, 150);
    }
  }

  public synchronizedScrolling(): void {}

  public trackById(paragraph: any) {
    return paragraph.id;
  }

  private async buildPage(id: string, highlighting: string[] = []) {
    const chapter = await this.getChapter(id);

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

    await this.chapterService.buildParagraphs({
      paragraphs: this.dataService.paragraphs,
      verses: this.dataService.verses,
    });

    this.dataService.chapter2 = chapter;
    this.dataService.header = filter(
      this.dataService.verses,
      (verse: Verse) => {
        return verse.header;
      },
    );
    return v;
  }
  private async getChapter(id: string) {
    let chapter = this.dataService.chapter2;
    if (this.pageId !== id) {
      chapter = await this.chapterService.getChapter(id);

      this.dataService.paragraphs = cloneDeep(chapter.paragraphs);
      this.dataService.verses = cloneDeep(chapter.verses);
    }
    return chapter;
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
}
