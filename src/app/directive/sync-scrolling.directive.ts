import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSyncScrolling]'
})
export class SyncScrollingDirective {
  @Input()
  defaultColor: string;
  constructor(private element: ElementRef) {}

  @HostListener('touchend', ['$event'])
  onTouchEnd() {
    console.log('yvtctc');
  }
}
