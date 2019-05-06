import { Injectable } from '@angular/core';
import {
  cloneDeep,
  concat,
  difference,
  filter,
  first,
  isEqual,
  last,
  merge,
  range,
  uniq,
} from 'lodash';

import { Verse, W } from 'oith.models/dist';
import { cloneRange, getBoundingClientRect } from '../../HtmlFunc';
import { ChapterService } from './chapter.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class WTagService {
  public cloneRange: Range | undefined;
  public marked: boolean = false;
  public popupTimeout: NodeJS.Timer;
  public rangeInterval: any;
  public showPopup: boolean = false;
  public wTagColorPaletteTop: string = '0px';
  public wTagPopupleft: string = '0px';

  public wTagPopupTop: string = '0px';
  private bodyBlockElement: Element;
  private wTags: Array<{ id: string; w: W }> = [];
  constructor(
    private dataService: DataService,
    private chapterService: ChapterService,
  ) {
    // this.bodyBlockElement = document.getElementById('bodyBlock');
  }
  public convertRange(
    node: Node,
    offSet: number,
  ): { lastID: string; offSet: number; startID: string } {
    const wIDS = node.parentElement
      ? node.parentElement.getAttribute('w-ids')
      : undefined;
    if (wIDS) {
      const lastID = last(wIDS.split(','));
      const startID = first(wIDS.split(','));
      if (lastID && startID) {
        return {
          lastID,
          offSet,
          startID,
        };
      }
    }
    throw new Error('No Range avaliable');
  }

  public copyText() {
    this.marked = true;
    if (this.cloneRange) {
      const selection = this.cloneRange.cloneContents();
      const textCopyArea = document.querySelector('#textCopyArea');
      const windowSelection = window.getSelection();
      if (textCopyArea && windowSelection) {
        textCopyArea.appendChild(selection);
        const range = document.createRange();
        range.selectNodeContents(textCopyArea);
        windowSelection.removeAllRanges();
        windowSelection.addRange(range);

        document.execCommand('copy');
        windowSelection.empty();
      }
    }
    this.showPopup = false;
    this.marked = false;
  }
  public hasNodeName(range: Range) {
    const validNodeNames = ['W'];
    const invalidNodeNames = ['DIV', 'P'];

    return (
      validNodeNames.includes(range.startContainer.parentElement.nodeName) &&
      validNodeNames.includes(range.endContainer.parentElement.nodeName) &&
      !invalidNodeNames.includes(range.commonAncestorContainer.nodeName)
    );
  }

  public highlightClick() {
    console.log('aoisdfjoaisdfjoiasjdfasdf');

    this.marked = true;
    this.markText();
  }
  public init() {
    clearInterval(this.rangeInterval);
    this.rangeInterval = setInterval(async () => {
      const r = window.getSelection();
      if (r && this.checkTextSelection(r)) {
        this.cloneRange = await cloneRange();
        const rect = await getBoundingClientRect(this.cloneRange);

        if (this.cloneRange && rect) {
          this.wTagPopupTop = `${rect.top - 90}px`;
          this.wTagColorPaletteTop = `${rect.top - 120}px`;
          this.wTagPopupleft = `${this.cloneRange.getClientRects()[0].left}px`;
          this.showPopup = true;
        }
      } else {
        this.showPopup = false;
      }
    }, 100);
  }

  public async insertNewWTags(verses: W[]) {
    // verses.forEach(verse => {
    //   const newWTags = merge(
    //     filter(this.wTags, w => {
    //       return w.id === verse._id;
    //     }),
    //   ) as Array<{ id: string; w: W }>;
    //   if (newWTags.length > 0) {
    //     let newVerse = [];
    //     verse.wTags.forEach(wTag => {
    //       if ((wTag as any).childWTags) {
    //         // const a = cloneDeep();
    //         this.insertNewAWTags(wTag, newWTags, newVerse);
    //       } else {
    //         newVerse = concat(newVerse, this.expandWtags(wTag, newWTags));
    //       }
    //     });
    //     const mergeWTag = [];
    //     this.mergeWTags(newVerse, mergeWTag);
    //     verse.wTags = mergeWTag;
    //     // console.log(mergeWTag);
    //   }
    //   verse.wTags.forEach(m => {
    //     const f = first(m.id);
    //     const l = last(m.id);
    //     m.text = verse.text.substring(f, l + 1);
    //     m.id = [f, l];
    //   });
    // });
    // this.dataService.verses = verses;
    // await this.chapterService.resetNoteVisibility(
    //   this.dataService.chapter2,
    //   this.dataService.noteVisibility,
    // );
    // await this.chapterService.buildWTags(
    //   this.dataService.verses,
    //   this.dataService.noteVisibility,
    // );
    // await this.chapterService.buildParagraphs(
    //   this.dataService.paragraphs,
    //   this.dataService.verses,
    // );
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
          !vereParent.classList.contains('verse') &&
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
            parseInt(startContainer.startID, 10) + startContainer.offSet,
            parseInt(endContainer.startID, 10) + endContainer.offSet,
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

      this.insertNewWTags(cloneDeep(this.dataService.baseChapter.verses));

      this.reset();
    }
  }

  public reset() {
    console.log(window.getSelection());

    this.cloneRange = undefined;
    this.showPopup = false;
  }

  public showWTagPopup() {
    // this.markText();
    // this.showPopup = true;
    // if (this.popupTimeout) {
    //   clearTimeout(this.popupTimeout);
    // }
    // this.popupTimeout = setTimeout(() => {
    // }, 2000);
  }

  private arrayIsEqual(arg1: any[], arg2: any[]) {
    return isEqual(uniq(arg1).sort(), uniq(arg2).sort());
  }
  private checkTextSelection(r: Selection) {
    let sameVerse = false;
    if (r.rangeCount > 0 && r.toString().trim() !== '') {
      const range = r.getRangeAt(0);
      const commonAncestorContainer = range.commonAncestorContainer;
      this.bodyBlockElement = document.getElementById('bodyBlock');
      return this.bodyBlockElement.contains(commonAncestorContainer);

      // range.startContainer.parentElement.nodeName === 'W' &&
      // range.endContainer.parentElement.nodeName === 'W' &&
      // range.commonAncestorContainer.nodeName !== 'DIV' &&
      // range.commonAncestorContainer.nodeName !== 'P'
      if (this.hasNodeName(range)) {
        sameVerse = true;
      }
    }

    return sameVerse;
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
            ? clonedWTag.classList.push('mark-text')
            : ((clonedWTag.classList = []),
              clonedWTag.classList.push('mark-text'));
          clonedWTag.highlightRefs
            ? clonedWTag.highlightRefs.push(new HighlightRef('', ''))
            : ((clonedWTag.highlightRefs = []),
              clonedWTag.highlightRefs.push(new HighlightRef('', '')));
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
      if (l && this.wTagIsEqual(l, hh)) {
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

  private wTagIsEqual(w1: IW, w2: IW): boolean {
    if ((w1 as any).childWTags || (w2 as any).childWTags) {
      return false;
    }
    if (
      w1.classList === w2.classList &&
      w1.highlighting === w2.highlighting &&
      w1.refs === w2.refs
    ) {
      return true;
    }

    return (
      this.arrayIsEqual(w1.classList, w2.classList) &&
      this.arrayIsEqual(w1.refs, w2.refs) &&
      this.arrayIsEqual(w1.highlighting, w2.highlighting)
    );
  }
}
