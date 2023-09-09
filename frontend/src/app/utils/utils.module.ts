import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NewTaskComponent } from "./new-task/new-task.component";
import { RegisterPendingComponent } from "./register-pending/register-pending.component";
import { RegisterPendingService } from "./register-pending/register-pending.service";
import { NewTaskService } from "./new-task/new-task.service";
import { NotificationsComponent } from "./notifications/notifications.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "../directives/directives.module";
import { LargeNotificationComponent } from "./large-notification/large-notification.component";
import { MaterialModule } from "../material.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    MaterialModule,
  ],
  declarations: [
    NewTaskComponent,
    NotificationsComponent,
    RegisterPendingComponent,
    LargeNotificationComponent,
  ],
  exports: [NewTaskComponent, NotificationsComponent],
  providers: [NewTaskService, RegisterPendingService],
  entryComponents: [LargeNotificationComponent, RegisterPendingComponent],
})
export class UtilsModule {}
