import { Injectable } from '@angular/core';
import {
  clone,
  cloneDeep,
  concat,
  debounce,
  difference,
  filter,
  find,
  first,
  isEqual,
  last,
  merge,
  range,
  uniq,
} from 'lodash';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Verse } from '../modelsJson/Verse';
import { aW, IW, W } from '../modelsJson/W';
import { ChapterService } from './chapter.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class WTagService {
  public cloneRange: Range;
  public popupTimeout: NodeJS.Timer;
  public rangeInterval: any;
  public showPopup: boolean = false;
  public wTagPopupleft: string = '0px';

  public wTagPopupTop: string = '0px';
  private wTags: Array<{ id: string; w: IW }> = [];
  constructor(
    private dataService: DataService,
    private chapterService: ChapterService,
  ) {}
  public convertRange(
    node: Node,
    offSet: number,
  ): { lastID: string; offSet: number; startID: string } {
    return {
      startID: first(node.parentElement.getAttribute('w-ids').split(',')),
      lastID: last(node.parentElement.getAttribute('w-ids').split(',')),
      offSet,
    };
  }

  public init() {
    clearInterval(this.rangeInterval);
    this.rangeInterval = setInterval(() => {
      if (
        window.getSelection().rangeCount > 0 &&
        window
          .getSelection()
          .toString()
          .trim() !== ''
      ) {
        this.cloneRange = window
          .getSelection()
          .getRangeAt(0)
          .cloneRange();

        this.wTagPopupTop = `${this.cloneRange.startContainer.parentElement.getBoundingClientRect()
          .top - 90}px`;
        this.wTagPopupleft = `${this.cloneRange.getClientRects()[0].left}px`;
      }
    }, 100);
  }
  public async insertNewWTags(
    verses: Verse[],
    wTags: Array<{ id: string; w: IW }>,
  ) {
    verses.forEach(verse => {
      const newWTags = merge(
        filter(this.wTags, w => {
          return w.id === verse.id;
        }),
      ) as Array<{ id: string; w: IW }>;
      if (newWTags.length > 0) {
        let newVerse = [];
        verse.wTags.forEach(wTag => {
          if ((wTag as any).childWTags) {
            // const a = cloneDeep();
            this.insertNewAWTags(wTag, newWTags, newVerse);
          } else {
            newVerse = concat(newVerse, this.expandWtags(wTag, newWTags));
          }
        });
        const mergeWTag = [];
        this.mergeWTags(newVerse, mergeWTag);

        verse.wTags = mergeWTag;
        // console.log(mergeWTag);
      }
      verse.wTags.forEach(m => {
        const f = first(m.id);
        const l = last(m.id);

        m.text = verse.text.substring(f, l + 1);
        m.id = [f, l];
      });
    });

    this.dataService.verses = verses;

    await this.chapterService.resetNoteVisibility(
      this.dataService.chapter2,
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
  }

  public isEqual(refs1: [], refs2: []): boolean {
    // throw new Error("Method not implemented.");
    if (refs1 === refs2) {
      return true;
    }
    if (!refs1 || !refs2) {
      return false;
    }
    return isEqual(uniq(refs1).sort(), uniq(refs2).sort());

    const diff = difference(refs1, refs2);

    return diff.length === 0;
    let equals = false;
    if (refs1 && refs2) {
      refs1.forEach(f => {
        if (refs2.includes(f)) {
          equals = true;
        }
      });
    }
    return equals;
  }
  public markText() {
    if (
      !(
        this.cloneRange.startContainer === this.cloneRange.endContainer &&
        this.cloneRange.startOffset === this.cloneRange.endOffset
      )
    ) {
      let vereParent = this.cloneRange.commonAncestorContainer as Element;
      while (
        !vereParent.classList ||
        (vereParent.classList &&
          !(vereParent as Element).classList.contains('verse') &&
          !(vereParent.nodeName === 'span'))
      ) {
        vereParent = vereParent.parentNode as Element;
      }
      const startContainer = this.convertRange(
        this.cloneRange.startContainer,
        this.cloneRange.startOffset,
      );
      const endContainer = this.convertRange(
        this.cloneRange.endContainer,
        this.cloneRange.endOffset,
      );
      console.log(startContainer);
      console.log(endContainer);

      this.wTags.push({
        id: vereParent.id,
        w: new W(
          range(
            parseInt(startContainer.startID) + startContainer.offSet,
            parseInt(endContainer.startID) + endContainer.offSet,
          ),
        ),
      });
      // console.log(
      //   this.cloneRange.toString() ===
      //     vereParent.textContent.substring(
      //       parseInt(startContainer.startID) + startContainer.offSet,
      //       parseInt(endContainer.startID) + endContainer.offSet,
      //     ),
      // );
      // console.log(this.wTags);

      this.insertNewWTags(
        cloneDeep(this.dataService.chapter2.verses),
        this.wTags,
      );

      this.reset();
    }
  }

  public reset() {
    this.cloneRange = undefined;
    this.showPopup = false;
  }

  public showWTagPopup() {
    this.markText();
    this.showPopup = true;
    // if (this.popupTimeout) {
    //   clearTimeout(this.popupTimeout);
    // }
    // this.popupTimeout = setTimeout(() => {
    // }, 2000);
  }
  private expandWtags(wTag: W, newWTags: Array<{ id: string; w: IW }>) {
    const newVerse = [];
    let start = first(wTag.id);
    const end = last(wTag.id);
    for (start; start <= end; start++) {
      // const element = array[x];
      const clonedWTag = cloneDeep(wTag);
      clonedWTag.id = [];
      clonedWTag.id.push(start);
      newWTags.forEach(newTag => {
        if (newTag.w.id.includes(start)) {
          clonedWTag.classList
            ? clonedWTag.classList.push('red')
            : ((clonedWTag.classList = []), clonedWTag.classList.push('red'));
          clonedWTag.refs
            ? clonedWTag.refs.push(newTag.w.refs[0])
            : ((clonedWTag.refs = []), clonedWTag.refs.push(newTag.w.refs[0]));
          // console.log(eff.w.refs);
        }
      });
      newVerse.push(clonedWTag);
    }
    return newVerse;
  }

  private insertNewAWTags(
    wTag: W,
    newWTags: Array<{ id: string; w: IW }>,
    newVerse: any[],
  ) {
    const clonedWTag = (cloneDeep(wTag) as any) as aW;
    let awNewVerse = [];
    clonedWTag.childWTags.forEach(h => {
      awNewVerse = concat(awNewVerse, this.expandWtags(h, newWTags));
    });
    clonedWTag.childWTags = awNewVerse;
    newVerse.push(clonedWTag);
  }

  private mergeWTags(newVerse: any[], mergeWTag: any[]) {
    newVerse.forEach(hh => {
      const l = last(mergeWTag);
      if (
        l &&
        !(hh as any).childWTags &&
        !(l as any).childWTags &&
        this.isEqual(l.refs, hh.refs) &&
        this.isEqual(hh.classList, l.classList)
      ) {
        l.id.push(last(hh.id));
      } else if ((hh as any).childWTags) {
        const m = [];
        this.mergeWTags((hh as aW).childWTags, m);
        // console.log(m);

        (hh as aW).childWTags = m;

        mergeWTag.push(cloneDeep(hh));
      } else {
        mergeWTag.push(cloneDeep(hh));
      }
    });
  }
}
