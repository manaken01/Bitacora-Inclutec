import { MatPaginatorIntl } from "@angular/material";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "../../../material.module";
import { SearchRoutingModule } from "./management-routing.module";
import { WorklogService } from "../../../services/worklog.service";
import { EncryptService } from "../../../services/encrypt.service";
import { ProjectsService } from "../../../services/projects.service";
import { UserService } from "../../../services/user.service";
import { UtilsModule } from "../../../utils/utils.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { ProjectsComponent } from "./projects/projects.component";
import { ManagementComponent } from "./management.component";
import { UsersListComponent } from "./users-list/users-list.component";
import { ProjectsListComponent } from "./projects-list/projects-list.component";
import { ProjectInfoComponent } from "./projects-list/project-info/project-info.component";
import { ProjectEditorComponent } from "./projects-list/project-editor/project-editor.component";
import { ModalCollaboratorsComponent } from "./projects/modal-collaborators/modal-collaborators.component";
import { ConfirmEditsComponent } from "./projects/confirm-edits/confirm-edits.component";
import { getSpanishPaginator } from "./spanish-paginator";
import { UserEditorComponent } from "./users-list/user-editor/user-editor.component";
import { ConfirmChangeComponent } from "./users-list/confirm-change/confirm-change.component";

@NgModule({
  declarations: [
    ProjectsComponent,
    ManagementComponent,
    UsersListComponent,
    ProjectsListComponent,
    ProjectInfoComponent,
    ProjectEditorComponent,
    ModalCollaboratorsComponent,
    ConfirmEditsComponent,
    UserEditorComponent,
    ConfirmChangeComponent,
  ],
  imports: [
    SearchRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DirectivesModule,
    UtilsModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useValue: getSpanishPaginator(),
    },
    WorklogService,
    EncryptService,
    ProjectsService,
    UserService,
  ],
  entryComponents: [
    ProjectInfoComponent,
    ProjectEditorComponent,
    ModalCollaboratorsComponent,
    ConfirmEditsComponent,
    UserEditorComponent,
    ConfirmChangeComponent,
  ],
})
export class ManagementModule {}
