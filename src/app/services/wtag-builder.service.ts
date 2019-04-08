import { Injectable } from '@angular/core';
import { first, last } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class WTagService {
  public cloneRange: Range;
  public rangeInterval: any;

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
        // this.wTagService.getSelection = window.getSelection();
        this.cloneRange = window
          .getSelection()
          .getRangeAt(0)
          .cloneRange();
        // console.log(this.getSelection.getRangeAt(0).cloneRange());
      }
      // console.log();/
    }, 100);
  }

  public markText() {
    // const range = this.cloneRange;
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
      console.log(
        this.cloneRange.toString() ===
          vereParent.textContent.substring(
            parseInt(startContainer.startID) + startContainer.offSet,
            parseInt(endContainer.startID) + endContainer.offSet,
          ),
      );
      this.reset();
    }
  }

  public reset() {
    this.cloneRange = undefined;
  }
}
