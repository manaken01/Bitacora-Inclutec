import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { WorklogService } from "../../../../../services/worklog.service";
import { EncryptService } from "../../../../../services/encrypt.service";

@Component({
  selector: "app-project-editor",
  templateUrl: "./project-editor.component.html",
  styleUrls: ["./project-editor.component.scss"],
})
export class ProjectEditorComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public editorForm: FormGroup;
  public projectName: string;
  public collabList: any;
  public outsideCollaborators: any;

  /**
   * Project editor constructor
   * @param worklogService
   * @param dialogRef
   * @param formBuilder
   * @param router
   * @param data
   */
  constructor(
    private worklogService: WorklogService,
    public dialogRef: MatDialogRef<ProjectEditorComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private encryptService: EncryptService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectName = this.data.projectName;
    this.collabList = [];
    this.outsideCollaborators = [];
  }

  ngOnInit() {
    this.formConfiguration();
    this.loadCollaborators();
    this.loadOutsideCollab();
    this.editorForm.controls.projectName.setValue(this.projectName);
    this.editorForm.controls.status.setValue(this.data.status);
  }

  onNoClick(message: string): void {
    this.dialogRef.close(message);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Creates the form configuration.
   */
  formConfiguration() {
    this.editorForm = this.formBuilder.group({
      projectName: new FormControl("", [
        Validators.required,
        Validators.maxLength(90),
      ]),
      status: new FormControl(""),
      collaborators: new FormArray([]),
      newCollaborators: new FormControl(""),
    });
  }

  /**
   * Redirects to the project view
   */
  redirectToProject() {
    const idProject = this.encryptService.encryptVariable(
      this.data.idProjectsPk
    );
    const projectName = this.encryptService.encryptVariable(this.projectName);
    this.onNoClick("cancel");
    return this.router.navigate(["dashboard/management/project"], {
      queryParams: { project: idProject, name: projectName },
    });
  }

  /**
   * Loads all the collaborators of a project and creates a new controller for each collaborator
   */
  loadCollaborators() {
    this.worklogService
      .getProjectCollaborators(this.data.idProjectsPk)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.collabList = response;
        response.forEach((element) => {
          this.addCollaboratorsInput();
        });
      });
  }

  /**
   * Getter of phases collaborators which its declare on the form config
   */
  get collaborators() {
    return this.editorForm.get("collaborators") as FormArray;
  }

  /**
   * Push a new control to the formArray collaborators
   */
  addCollaboratorsInput() {
    this.collaborators.push(new FormControl(true));
  }

  /**
   * Updates the data of a project
   * @param test
   */
  updateProject(credencials: any) {
    this.data.status = credencials.status;
    this.data.projectName = credencials.projectName;
    this.data.idUnitsFk = 2;
    if (credencials.collaborators.length !== 0) {
      const deletedUser = this.validateDelete(credencials.collaborators);
      if (deletedUser.length > 0) {
        deletedUser.forEach((element) => {
          this.deleteUserByProject({
            idUser: element.idUser,
            idProject: this.data.idProjectsPk,
          });
        });
      }
    }
    if (credencials.newCollaborators !== "") {
      this.collaboratorToProject(credencials.newCollaborators);
    }
    this.worklogService
      .putProjectInfo(this.data)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.onNoClick("success");
      });
  }

  /**
   * Loads the users that are not working on the project selected
   */
  loadOutsideCollab() {
    this.worklogService
      .getOutsideCollaborators(this.data.idProjectsPk)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.outsideCollaborators = response;
      });
  }

  /**
   * Bind new collaborators to the project selected
   * @param collaborators
   */
  collaboratorToProject(collaborators) {
    let body;
    collaborators.forEach((user) => {
      body = {
        idUsersFk: user,
        idProjectsFk: this.data.idProjectsPk,
      };
      this.worklogService
        .postUserByProject(body)
        .pipe(takeUntil(this.onDestroy))
        .subscribe();
    });
  }
  /**
   * Returns the values of the form array that has been change to false
   * @param collaborators
   */
  validateDelete(collaborators) {
    const result = [];
    collaborators.forEach((element, index) => {
      if (!element) {
        result.push(this.collabList[index]);
      }
    });
    return result;
  }
  /**
   * Deletes the binding between an user and a project
   * @param body
   */
  deleteUserByProject(body) {
    this.worklogService
      .deleteUserByProject(body)
      .pipe(takeUntil(this.onDestroy))
      .subscribe();
  }
}
