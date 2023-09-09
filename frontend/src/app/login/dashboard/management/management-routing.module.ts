import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsComponent } from "./projects/projects.component";
import { ManagementComponent } from "./management.component";

const routes: Routes = [
  {
    path: "",
    component: ManagementComponent,
  },
  {
    path: "project",
    component: ProjectsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
