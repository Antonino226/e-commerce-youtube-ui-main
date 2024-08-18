import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective {
  @Output() lazyLoad = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkViewport();
  }

  ngAfterViewInit() {
    this.checkViewport();
  }

  private checkViewport() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    if (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight + 100 && // Margine di tolleranza di 100px
      rect.right <= windowWidth
    ) {
      this.lazyLoad.emit();
    }
  }
}
