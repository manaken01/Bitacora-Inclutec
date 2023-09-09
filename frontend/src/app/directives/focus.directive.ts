import { Directive, Input, ElementRef, AfterViewInit } from "@angular/core";

/**
 * Sets focus on an element if the value focus is true
 */
@Directive({
  selector: "[focus]"
})
export class FocusDirective implements AfterViewInit {
  @Input() public focus: boolean;

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    if (this.focus) {
      this.element.nativeElement.focus();
    }
  }
}
