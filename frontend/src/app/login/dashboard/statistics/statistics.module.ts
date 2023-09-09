import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchRoutingModule } from "./statistics-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WorklogService } from "../../../services/worklog.service";
import { EncryptService } from "../../../services/encrypt.service";
import { ProjectsService } from "../../../services/projects.service";
import { UtilsModule } from "../../../utils/utils.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { StatisticsComponent } from "./statistics.component";
import { CommonConstants } from "../../../common/common.constant";
import { GraphicsConstants } from "../../../common/graphics.constant";

import { ChartModule, HIGHCHARTS_MODULES } from "angular-highcharts";
import * as exporting from "highcharts/modules/exporting.src";
import * as exportdata from "highcharts/modules/export-data.src";
import * as accesibility from "highcharts/modules/accessibility.src";
import * as sankey from "highcharts/modules/sankey.src";
import * as PatternFill2 from "highcharts-pattern-fill/pattern-fill-v2";

@NgModule({
  declarations: [StatisticsComponent],
  imports: [
    SearchRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DirectivesModule,
    UtilsModule,
    ChartModule,
  ],
  providers: [
    WorklogService,
    EncryptService,
    ProjectsService,
    CommonConstants,
    GraphicsConstants,
    {
      provide: HIGHCHARTS_MODULES,
      useFactory: () => [
        exporting,
        accesibility,
        exportdata,
        sankey,
        PatternFill2,
      ],
    },
  ],
})
export class StatisticsModule {}
