import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {
  constructor() {
    this.togglePanes();
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
      console.log('x: ' + event.x);
      if (
        !element.classList.contains('left-pane-ignore') &&
        // viewWidth < 1220 &&
        // leftPaneNav.classList.contains('grid') &&
        (event.x > 48 || event.y > 48)
      ) {
        console.log(event);
        // this.setDisplay(leftPaneNav, 'none');
        this.switchClasses(
          leftPaneNav,
          ['none-s', 'none-m'],
          ['grid-s', 'grid-m']
        );
        // console.log(viewWidth);
      }
    };
  }

  public togglePane(id: string, minViewWidth: number): void {
    const element = document.getElementById(id);

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
