import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TrapFocusDirective } from "./trapFocus.directive";
import { FocusDirective } from "./focus.directive";

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [TrapFocusDirective, FocusDirective],
  exports: [TrapFocusDirective, FocusDirective]
})
export class DirectivesModule {}
