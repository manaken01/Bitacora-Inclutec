import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { EncryptService } from "../../../../services/encrypt.service";
import { CommonConstants } from "../../../../common/common.constant";
import { UserService } from "../../../../services/user.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
  message: string;
  title: string;
  type: string;
}

@Component({
  selector: "app-request-project",
  templateUrl: "./request-project.component.html",
  styleUrls: ["./request-project.component.scss"],
  providers: [EncryptService, CommonConstants, UserService],
})
export class RequestProjectComponent implements OnInit {
  protected onDestroy = new Subject<void>();
  public requestForm: FormGroup;
  public projectList: any;
  public isReady: boolean;
  public type: string;
  public message: any;
  public messageModal: string;
  public typeSuccess: boolean;

  /**
   * Request project constructor
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
    public dialogRef: MatDialogRef<RequestProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.projectList = [];
  }

  ngOnInit() {
    this.formConfig();
    this.projects();
  }

  onNoClick(message: string): void {
    this.dialogRef.close(message);
  }

  formConfig() {
    this.requestForm = this.formBuilder.group({
      project: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
      ]),
    });
  }

  /**
   * Loads all the projects the user is not working on
   */
  projects() {
    const idUser = this.encryptService.desencrypt("idUser");
    this.userService
      .otherProjects(idUser)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.projectList = response;
      });
  }

  /**
   * Sends the email request to the admin
   * @param credencials
   */
  requestProject(credencials) {
    const idUser = this.encryptService.desencrypt("idUser");
    let message = "";
    this.userService
      .projectRequest(idUser, credencials.project)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response) => {
          message = "success";
          this.onNoClick(message);
        },
        (error) => {
          message = "Error, por favor vuelva a iniciar sesión.";
          this.showError(message);
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
