import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {
  constructor() {
    this.togglePanes();
  }

  private togglePanes() {
    document.onclick = event => {
      const element = event.target as HTMLElement;
      const id = element.id;
      const viewWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );

      if (
        id !== 'navToggle' &&
        id !== 'leftPaneNav' &&
        !element.classList.contains('left-pane-ignore') &&
        viewWidth < 1220
      ) {
        const leftPaneNav = document.getElementById('leftPaneNav');
        this.setDisplay(leftPaneNav, 'none');
        console.log(viewWidth);
      }
    };
  }

  public toggleDisplay(id: string, on: string, off: string): void {
    const element = document.getElementById(id);

    const display = window.getComputedStyle(element).display;

    switch (display) {
      case on: {
        this.setDisplay(element, off);
        break;
      }
      case off:
      default: {
        this.setDisplay(element, on);
        break;
      }
    }
  }

  private setDisplay(element: HTMLElement, toggle: string) {
    element.style.display = toggle;
  }
}
