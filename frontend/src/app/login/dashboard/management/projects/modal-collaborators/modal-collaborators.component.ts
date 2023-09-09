import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, OnInit, Inject } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

import { WorklogService } from "../../../../../services/worklog.service";

@Component({
  selector: "app-modal-collaborators",
  templateUrl: "./modal-collaborators.component.html",
  styleUrls: ["./modal-collaborators.component.scss"],
})
export class ModalCollaboratorsComponent implements OnInit {
  protected onDestroy = new Subject<void>();
  public editorForm: FormGroup;
  public outsideCollaborators: any;

  constructor(
    private worklogService: WorklogService,
    public dialogRef: MatDialogRef<ModalCollaboratorsComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.outsideCollaborators = [];
  }

  ngOnInit() {
    this.formConfiguration();
    this.loadOutsideCollab();
    this.editorForm.controls.status.setValue(this.data.status);
  }

  onNoClick(message): void {
    this.dialogRef.close(message);
  }

  /**
   * Editor form configuration
   */
  formConfiguration() {
    this.editorForm = this.formBuilder.group({
      status: new FormControl("", Validators.required),
      newCollaborators: new FormControl(""),
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
    collaborators.forEach((user) => {
      this.worklogService
        .postUserByProject({
          idUsersFk: user,
          idProjectsFk: this.data.idProjectsPk,
        })
        .pipe(takeUntil(this.onDestroy))
        .subscribe();
    });
  }

  /**
   * Updates the status of the project created
   * @param credencials
   */
  updateStatus(credencials) {
    this.data.status = credencials.status;
    if (credencials.newCollaborators !== "") {
      this.collaboratorToProject(credencials.newCollaborators);
    }
    this.worklogService
      .putProjectInfo(this.data)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response) => {
          this.onNoClick("success");
        },
        (error) => {
          this.onNoClick("warning");
        }
      );
  }
}
