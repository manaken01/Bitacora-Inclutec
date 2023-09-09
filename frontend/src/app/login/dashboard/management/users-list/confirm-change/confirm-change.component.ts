import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-confirm-change",
  templateUrl: "./confirm-change.component.html",
  styleUrls: ["./confirm-change.component.scss"],
})
export class ConfirmChangeComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public editorForm: FormGroup;
  public username: string;
  public userData: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmChangeComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.username = this.data.user.name + " " + this.data.user.lastName;
    this.userData = this.data.user;
  }

  ngOnInit() {
    this.formConfiguration();
    this.editorForm.controls.status.setValue(this.data.newStatus);
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
      status: new FormControl("", [Validators.required]),
    });
  }

  /**
   * Executes the user update
   * @param credencials
   */
  performAction(credencials) {
    this.userData.isActive = credencials.status;
    this.userService
      .putUserInfo(this.userData)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.onNoClick("sucess");
      });
  }
}
