import { NgModule } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";
import { MatPaginatorIntl } from "@angular/material";
import { getSpanishPaginator } from "./spanish-paginator";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchRoutingModule } from "./search-routing.module";
import { SearchComponent } from "./search.component";
import { ListComponent } from "./list/list.component";
import { WorklogService } from "../../../services/worklog.service";
import { EncryptService } from "../../../services/encrypt.service";
import { DirectivesModule } from "../../../directives/directives.module";
import { CalendarComponent } from "./calendar/calendar.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { UtilsModule } from "../../../utils/utils.module";
import localeEs from "@angular/common/locales/es";
import { MaterialModule } from "../../../material.module";

registerLocaleData(localeEs);

@NgModule({
  declarations: [SearchComponent, ListComponent, CalendarComponent],
  imports: [
    SearchRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    UtilsModule,
    MaterialModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getSpanishPaginator() },
    WorklogService,
    EncryptService,
  ],
})
export class SearchModule { }
