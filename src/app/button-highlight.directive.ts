import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appButtonHighlight]'
})
export class ButtonHighlightDirective {
  constructor(private el: ElementRef) {}

  @Input()
  defaultColor: string;
  @Input()
  border: string;

  @Input('appButtonHighlight')
  highlightColor: string;

  @Input('appButtonHighlight')
  defaultBorder: string;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight(
      this.highlightColor || this.defaultColor || '#8cadb8',
      this.border || this.defaultBorder || '1px solid black'
    );
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlight(null, null);
  }

  private highlight(color: string, border: string) {
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.border = border;

    // border-color: black;
    // border-style: solid;
    // border-width: 1px;
  }
}
