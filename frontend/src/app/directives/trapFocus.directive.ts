import { Directive, ElementRef, HostListener } from "@angular/core";
import * as $ from "jquery";
/**
 * Gets the first and last element of a modal and sets
 * the focus on the contrary if the activeElement gets to one them
 */
@Directive({
  selector: "[appTrapFocus]"
})
export class TrapFocusDirective {
  KEYCODE_TAB: number = 9;

  constructor(private hostElement: ElementRef) {}

  ngOnInit() {}

  @HostListener("keydown", ["$event"])
  onKeyDown(e: KeyboardEvent): any {
    if (e.key === "Tab" || e.keyCode === this.KEYCODE_TAB) {
      let focusableEls = this.hostElement.nativeElement;
      let modalContent = $(focusableEls).find("a, :input, [tabindex]");
      var firstFocusableEl = modalContent.first()[0];
      var lastFocusableEl = modalContent.last()[0];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          e.preventDefault();
        }
      }
    }
  }
}
