import { NgModule } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegFormRoutingModule } from "./reg-form-routing.module";
import { RegFormComponent } from "./reg-form.component";
import { UtilsModule } from "../../../../utils/utils.module";
import { DirectivesModule } from "../../../../directives/directives.module";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import localeEs from "@angular/common/locales/es";
import { RegisterModalComponent } from "./register-modal/register-modal.component";
import { MaterialModule } from "../../../../material.module";

registerLocaleData(localeEs);

@NgModule({
  declarations: [RegFormComponent, RegisterModalComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RegFormRoutingModule,
    UtilsModule,
    DirectivesModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [],
  entryComponents: [RegisterModalComponent],
})
export class RegFormModule { }
