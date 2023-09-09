import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./dashboard-routing.module";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

import { DashboardComponent } from "./dashboard.component";
import { PendingComponent } from "./pending/pending.component";
import { TasksComponent } from "./tasks/tasks.component";
import { NavbarComponent } from "./../navbar/navbar.component";
import { FooterComponent } from "./../footer/footer.component";
import { ItemsComponent } from "../navbar/items/items.component";
import { RegisterComponent } from "./register/register.component";
import { LoadingComponent } from "./../loading/loading.component";
import { UtilsModule } from "../../utils/utils.module";
import { MaterialModule } from "../../material.module";

@NgModule({
  declarations: [
    DashboardComponent,
    PendingComponent,
    TasksComponent,
    NavbarComponent,
    FooterComponent,
    ItemsComponent,
    RegisterComponent,
    LoadingComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    NgbModule,
    FormsModule,
    UtilsModule,
    MaterialModule,
  ],
  providers: [],
})
export class DashboardModule {}
