import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { LoginRoutingModule } from "./login-routing.module";

import { LoginComponent } from "./login.component";
import { Error404Component } from "./error404/error404.component";
import { AlertsComponent } from "./alerts/alerts.component";
import { RegisterUserComponent } from "./register-user/register-user.component";
import { MaterialModule } from "../material.module";

@NgModule({
  declarations: [
    LoginComponent,
    Error404Component,
    AlertsComponent,
    RegisterUserComponent,
  ],
  imports: [
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
  ],
  providers: [],
  exports: [LoginComponent],
})
export class LoginModule {}
