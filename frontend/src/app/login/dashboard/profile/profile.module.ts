import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProfileRoutingModule } from "./profile-routing.module";
import { MaterialModule } from "../../../material.module";
import { ProfileComponent } from "./profile.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { UtilsModule } from "../../../utils/utils.module";
import { RequestProjectComponent } from "./request-project/request-project.component";

@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    RequestProjectComponent,
  ],
  imports: [
    ProfileRoutingModule,
    CommonModule,
    UtilsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  entryComponents: [ChangePasswordComponent, RequestProjectComponent],
})
export class ProfileModule {}
