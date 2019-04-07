import { Injectable } from '@angular/core';
import { first, last } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class WTagService {
  public cloneRange: Range;

  public markText() {
    const range = this.cloneRange;
    if (
      !(
        range.startContainer === range.endContainer &&
        range.startOffset === range.endOffset
      )
    ) {
      const startContainer = range.startContainer.parentElement;
      const endContainer = range.endContainer.parentElement;
      let vereParent = range.commonAncestorContainer as Element;
      while (
        !vereParent.classList ||
        (vereParent.classList &&
          !(vereParent as Element).classList.contains('verse') &&
          !(vereParent.nodeName === 'span'))
      ) {
        vereParent = vereParent.parentNode as Element;
      }
      const sC = {
        startID: first(
          range.startContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        lastID: last(
          range.startContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        offSet: range.startOffset,
      };
      const eC = {
        startID: first(
          range.endContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        lastID: last(
          range.endContainer.parentElement.getAttribute('w-ids').split(','),
        ),
        offSet: range.endOffset,
      };
      console.log(
        range.toString() ===
          vereParent.textContent.substring(
            parseInt(sC.startID) + sC.offSet,
            parseInt(eC.startID) + eC.offSet,
          ),
      );
      if (range.startContainer === range.endContainer) {
        // console.log(vereParent);
        console.log();

        console.log(vereParent.textContent);

        console.log(sC);
        console.log(eC);

        console.log(
          range.startContainer.textContent.substring(sC.offSet, eC.offSet),
        );
      }
    }
  }

  public reset() {}
}
