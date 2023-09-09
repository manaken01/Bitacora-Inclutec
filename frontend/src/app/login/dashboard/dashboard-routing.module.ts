import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { RegisterComponent } from "./register/register.component";
const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "register",
        component: RegisterComponent,
      },
      {
        path: "search",
        loadChildren: "./search/search.module#SearchModule",
      },
      {
        path: "statistics",
        loadChildren: "./statistics/statistics.module#StatisticsModule",
      },
      {
        path: "management",
        loadChildren: "./management/management.module#ManagementModule",
      },
      {
        path: "about",
        loadChildren: "./about/about.module#AboutModule",
      },
      {
        path: "register/form",
        loadChildren: "./register/reg-form/reg-form.module#RegFormModule",
      },
      {
        path: "profile",
        loadChildren: "./profile/profile.module#ProfileModule",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
