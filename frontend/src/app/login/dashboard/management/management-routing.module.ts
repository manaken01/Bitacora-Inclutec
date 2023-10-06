import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsComponent } from "./projects/projects.component";
import { ManagementComponent } from "./management.component";
import { RoleListComponent } from './login/dashboard/management/role-list/role-list.component';

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
  declarations: [RoleListComponent, RoleListComponent],
})
export class SearchRoutingModule {}
