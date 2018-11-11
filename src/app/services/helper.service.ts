import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {
  constructor() {
    // this.togglePanes();
  }
  public getWidth(): number {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  public togglePane2(id: string, pinWidth: number): void {
    console.log('called');
    const element = document.getElementById(id);

    const viewWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const gridOn = this.getToggleStrings('grid', viewWidth, pinWidth);
    const none = this.getToggleStrings('none', viewWidth, pinWidth);

    if (this.contains(element, gridOn)) {
      this.switchClasses(element, none, gridOn);
    } else {
      this.switchClasses(element, gridOn, none);
    }
  }

  public togglePane(id: string, minViewWidth: number): void {
    console.log('called2');
    const element = document.getElementById(id);
    // console.log('id');

    const viewWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );

    if (viewWidth < minViewWidth) {
      let gridOn = true;
      const gridClasses = ['grid-s'];
      const noneClasses = ['none-s'];
      if (minViewWidth === 1280) {
        gridOn =
          element.classList.contains('grid-s') ||
          element.classList.contains('grid-m');
        gridClasses.push('grid-m');
        noneClasses.push('none-m');
      } else {
        gridOn = element.classList.contains('grid-s');
      }

      if (gridOn) {
        this.switchClasses(element, noneClasses, gridClasses);
      } else {
        this.switchClasses(element, gridClasses, noneClasses);
      }
    } else {
      const gridOn = element.classList.contains('grid-l');
      if (gridOn) {
        this.switchClasses(element, ['none-l'], ['grid-l']);
      } else {
        this.switchClasses(element, ['grid-l'], ['none-l']);
      }
    }
  }

  public toggleNavButton(
    id: string,
    targetId: string,
    on: string,
    off: string
  ): void {
    console.log('called3');
    const element = document.getElementById(id);
    const target = document.getElementById(targetId);

    if (target.classList.contains(off)) {
      target.classList.add(on);
      element.classList.add('nav-btn-on');
      target.classList.remove(off);
    } else {
      target.classList.add(off);
      element.classList.remove('nav-btn-on');
      target.classList.remove(on);
    }
  }

  private switchClasses(
    element: HTMLElement,
    addClasses: string[],
    removeClasses: string[]
  ): void {
    console.log('called4');
    for (const addClass of addClasses) {
      element.classList.add(addClass);
    }
    for (const removeClass of removeClasses) {
      element.classList.remove(removeClass);
    }
  }

  private getToggleStrings(
    text: string,
    viewWidth: number,
    pinWidth: number
  ): string[] {
    console.log('called5');
    const classes: string[] = [];
    if (viewWidth >= 1280 && pinWidth >= 1280) {
      classes.push(text + '-l');
    } else if (viewWidth < 1280 && pinWidth >= 1280) {
      classes.push(text + '-m');
      classes.push(text + '-s');
    } else if (viewWidth >= 1080 && pinWidth >= 1080) {
      classes.push(text + '-l');
      classes.push(text + '-m');
    } else {
      classes.push(text + '-s');
    }
    return classes;
  }

  private contains(element: HTMLElement, classList: string[]): boolean {
    for (const cls of classList) {
      if (element.classList.contains(cls)) {
        return true;
      }
    }
    return false;
  }
}

// window.onresize = () => {
//   const viewWidth = Math.max(
//     document.documentElement.clientWidth,
//     window.innerWidth || 0
//   );
//   if (viewWidth < 1079.98) {
//     console.log('small  ');
//   } else if (viewWidth > 1079.98 && viewWidth < 1279.98) {
//     console.log('medium');
//   } else {
//     console.log('large');
//   }
// };
