import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {
  private smallWidth = 1080;
  private mediumWidth = 1280;

  constructor() {
    // this.togglePanes();
  }
  public getWidth(): number {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  private togglePanes() {
    document.onclick = event => {
      const element = event.target as HTMLElement;
      // const id = element.id;
      const viewWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );

      const leftPaneNav = document.getElementById('leftPaneNav');

      const rightPane = document.getElementById('study-notes-parent');
      if (
        !element.classList.contains('right-pane-ignore') &&
        (event.x < viewWidth - 48 || event.y > 48)
      ) {
        this.switchClasses(rightPane, ['none-s'], ['grid-s']);
        // console.log(viewWidth);
      }
      if (
        !element.classList.contains('left-pane-ignore') &&
        (event.x > 48 || event.y > 48)
      ) {
        this.switchClasses(
          leftPaneNav,
          ['none-s', 'none-m'],
          ['grid-s', 'grid-m']
        );
        // console.log(viewWidth);
      }
    };
  }

  public togglePane2(id: string, pinWidth: number): void {
    const element = document.getElementById(id);

    const viewWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const pin = viewWidth >= pinWidth;
    const gridOn = this.getToggleStrings('grid', viewWidth, pinWidth);
    const none = this.getToggleStrings('none', viewWidth, pinWidth);

    if (this.contains(element, gridOn)) {
      this.switchClasses(element, none, gridOn);
    } else {
      this.switchClasses(element, gridOn, none);
    }
  }

  public togglePane(id: string, minViewWidth: number): void {
    const element = document.getElementById(id);
    console.log('id');

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
    for (const addClass of addClasses) {
      element.classList.add(addClass);
    }
    for (const removeClass of removeClasses) {
      element.classList.remove(removeClass);
    }
  }

  private setDisplay(element: HTMLElement, toggle: string) {
    element.style.display = toggle;
  }

  private getToggleStrings(
    text: string,
    viewWidth: number,
    pinWidth: number
  ): string[] {
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
