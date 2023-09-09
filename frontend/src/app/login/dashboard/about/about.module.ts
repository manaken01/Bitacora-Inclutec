import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './about-routing.module';

import { AboutComponent } from './about.component';

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    SearchRoutingModule,
    CommonModule
  ],
  providers: []
})
export class AboutModule { }
