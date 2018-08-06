import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnChanges,
  OnInit,
  HostListener,
  NgZone,
  ContentChildren,
  ElementRef,
  Input,
  ViewChildren,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss']
})
export class BodyblockComponent implements OnInit {
  constructor(
    public fileManager: NavigationService,
    public httpClient: HttpClient,
    // public activatedRoute: ActivatedRoute,
    public chapterService: ChapterService,
    public navService: NavigationService,
    public saveState: SaveStateService,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone
  ) {}

  getBodyBlock(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.chapterService.bodyBlock
    );
    // return this.chapterService.bodyBlock;
  }
  ngOnInit() {}

  onScroll(event: any) {
    this.synchronizedScrolling();
    // this.ngZone.runOutsideAngular();
  }

  synchronizedScrolling(): void {
    const verses = document.querySelectorAll('span.verse');

    for (let x = 0; x <= verses.length; x++) {
      const element = verses[x];
      console.log(element);
    }
    console.log('test');
  }
}
