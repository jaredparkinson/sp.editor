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
        viewWidth < 1220 &&
        leftPaneNav.classList.contains('grid') &&
        (event.x > 48 || event.y > 48)
      ) {
        console.log(event);
        // this.setDisplay(leftPaneNav, 'none');
        this.switchClasses(leftPaneNav, ['none'], ['grid']);
        // console.log(viewWidth);
      }
    };
  }

  public toggleDisplay(id: string, on: string, off: string): void {
    const element = document.getElementById(id);

    const viewWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    if (viewWidth >= 1220) {
      return;
    }
    const asdf =
      element.classList.contains('grid') &&
      !element.classList.contains('none-m') &&
      !element.classList.contains('none-s');

    if (asdf) {
      this.switchClasses(element, ['none-s', 'none-m'], ['grid']);
    } else {
      this.switchClasses(element, ['grid'], ['none-s', 'none-m']);
    }

    // const display = window.getComputedStyle(element).display;

    // switch (display) {
    //   case on: {
    //     this.setDisplay(element, off);
    //     break;
    //   }
    //   case off:
    //   default: {
    //     this.setDisplay(element, on);
    //     break;
    //   }
    // }
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
