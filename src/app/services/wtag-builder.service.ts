import { Injectable } from '@angular/core';
import {
  clone,
  cloneDeep,
  debounce,
  filter,
  find,
  first,
  isEqual,
  last,
  merge,
  range,
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
        const newVerse = [];
        verse.wTags.forEach(wTag => {
          if ((wTag as any).childWTags) {
            const a = new aW();
          } else {
            let start = first(wTag.id);
            const end = last(wTag.id);
            for (start; start <= end; start++) {
              // const element = array[x];
              const clonedWTag = clone(wTag);
              clonedWTag.id = [];
              clonedWTag.id.push(start);
              newWTags.forEach(newTag => {
                if (newTag.w.id.includes(start)) {
                  clonedWTag.refs
                    ? clonedWTag.refs.push(newTag.w.refs[0])
                    : ((clonedWTag.refs = []),
                      clonedWTag.refs.push(newTag.w.refs[0]));

                  // console.log(eff.w.refs);
                }
              });
              newVerse.push(clonedWTag);
            }
          }
        });
        const mergeWTag = [];
        newVerse.forEach(hh => {
          const l = last(mergeWTag);
          if (
            l &&
            this.isEqual(l.refs, hh.refs) &&
            this.isEqual(hh.classList, l.classList)
          ) {
            l.id.push(last(hh.id));
          } else {
            mergeWTag.push(cloneDeep(hh));
          }
        });
        verse.wTags = mergeWTag;

        verse.wTags = mergeWTag;
        console.log(mergeWTag);
      }
      verse.wTags.forEach(m => {
        m.text = verse.text.substring(first(m.id), last(m.id) + 1);
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

    // this.wTags.forEach(newTag => {
    //   const newVerse = [];

    //   cloneDeep(
    //     find(this.dataService.chapter2.verses, v => {
    //       return v.id === newTag.id;
    //     }),
    //   ).wTags.forEach(wTag => {
    //     if ((wTag as any).childWTags) {
    //       const a = new aW();
    //     } else {
    //       let start = first(wTag.id);
    //       const end = last(wTag.id);
    //       for (start; start <= end; start++) {
    //         // const element = array[x];
    //         const clonedWTag = clone(wTag);
    //         clonedWTag.id = [];
    //         clonedWTag.id.push(start);
    //         if (newTag.w.id.includes(start)) {
    //           clonedWTag.refs
    //             ? clonedWTag.refs.push(newTag.w.refs[0])
    //             : ((clonedWTag.refs = []),
    //               clonedWTag.refs.push(newTag.w.refs[0]));

    //           // console.log(eff.w.refs);
    //         }
    //         newVerse.push(clonedWTag);
    //       }
    //     }
    //   });

    //   const mergeWTag = [];
    //   newVerse.forEach(hh => {
    //     const l = last(mergeWTag);
    //     if (
    //       l &&
    //       this.isEqual(l.refs, hh.refs) &&
    //       this.isEqual(hh.classList, l.classList)
    //     ) {
    //       l.id.push(last(hh.id));
    //     } else {
    //       mergeWTag.push(cloneDeep(hh));
    //     }
    //   });
    //   console.log(mergeWTag);
    // });
  }
  public isEqual(refs1: [], refs2: []): boolean {
    // throw new Error("Method not implemented.");
    if (refs1 === refs2) {
      return true;
    }
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
}
