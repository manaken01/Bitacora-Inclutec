import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { EncryptService } from "../../../../services/encrypt.service";
import { CommonConstants } from "../../../../common/common.constant";
import { UserService } from "../../../../services/user.service";

/**
 * Interface representing the data or structure of the calendar events
 */
export interface DialogData {
  start: any;
  end: any;
  title: string;
  id: any;
}

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
  providers: [EncryptService, CommonConstants, UserService],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public passwordForm: FormGroup;
  public isReady: boolean;
  public type: string;
  public message: any;
  public messageModal: string;
  public typeSuccess: boolean;

  public hideOld: boolean;
  public hideNew: boolean;
  public hideConfirm: boolean;

  /**
   * Change password constructor
   * @param encryptService
   * @param formBuilder
   * @param userService
   * @param dialogRef
   * @param data
   */
  constructor(
    private encryptService: EncryptService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.hideOld = true;
    this.hideNew = true;
    this.hideConfirm = true;
  }

  ngOnInit() {
    this.formConfig();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onNoClick(message: string): void {
    this.dialogRef.close(message);
  }

  formConfig() {
    this.passwordForm = this.formBuilder.group(
      {
        oldPassword: new FormControl("", [
          Validators.required,
          Validators.maxLength(255),
        ]),
        newPassword: new FormControl("", [
          Validators.required,
          Validators.maxLength(255),
        ]),
        confirmPassword: new FormControl("", [
          Validators.required,
          Validators.maxLength(255),
        ]),
      },
      {
        validator: this.userService.checkIfMatchingPasswords(
          "newPassword",
          "confirmPassword"
        ),
      }
    );
  }

  updatePassword(credencials: any) {
    const access_token = this.encryptService.desencrypt("accessToken");
    let message = "";
    this.userService
      .changePassword(
        credencials.oldPassword,
        credencials.newPassword,
        access_token
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response) => {
          message = "success";
          this.onNoClick(message);
        },
        (error) => {
          if (error.error.error.statusCode === 400) {
            message = "Contraseña actual incorrecta.";
            this.showError(message);
          } else {
            message = "Error, por favor vuelva a iniciar sesión.";
            this.showError(message);
          }
        }
      );
  }

  /**
   * Change the properties so the app-notification shows up as a success alert
   * @param message
   */
  showError(message) {
    this.isReady = true;
    this.typeSuccess = false;
    this.messageModal = message;
  }
  /**
   * Hides the alert after a period of time based on the setTimeOut
   * @param hide
   */
  handleNotificationEventEmitted(hide: any) {
    this.isReady = hide;
  }
}
