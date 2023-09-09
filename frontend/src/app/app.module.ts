import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { AppComponent } from "./app.component";
import { APP_CONFIG, AppConfig } from "../app.config";
import { LoginModule } from "./login/login.module";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UtilsModule } from "./utils/utils.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    LoginModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    UtilsModule
  ],
  providers: [
    {
      provide: APP_CONFIG,
      useValue: AppConfig
    },
    HttpClient
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
