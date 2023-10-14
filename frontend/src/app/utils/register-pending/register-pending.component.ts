import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {WorklogService} from '../../services/worklog.service';
import {EncryptService} from '../../services/encrypt.service';
import {CommonConstants} from '../../common/common.constant';

@Component({
  selector: 'app-register-pending',
  templateUrl: './register-pending.component.html',
  styleUrls: ['./register-pending.component.scss'],
  providers: [WorklogService, EncryptService, CommonConstants],
})
export class RegisterPendingComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public pendingForm: FormGroup;
  public isReady: boolean;
  public type: string;
  public messageModal: string;
  public typeSuccess: boolean;
  public hours: any;
  public minutes: any;
  public currentHour = 0;
  public currentMinute = 0;
  public taskSelected;
  public collaboratorsArray: any;
  public workCollaborators: any;

  /**
   * Register pending constructor
   * @param worklogService
   * @param formBuilder
   * @param encryptService
   * @param dialogRef
   * @param data
   */
  constructor(
    private worklogService: WorklogService,
    private formBuilder: FormBuilder,
    private encryptService: EncryptService,
    public dialogRef: MatDialogRef<RegisterPendingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.collaboratorsArray = [];
    this.workCollaborators = [];
    this.taskSelected = this.data.event;
    this.hours = this.fillArray(23);
    this.minutes = CommonConstants.minutesPending;
  }

  ngOnInit() {
    this.formConfig();
    this.loadCollaborators();
    this.formValues();
    this.existingCollab();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onNoClick(message): void {
    this.dialogRef.close(message);
  }

  /**
   * Form settings
   */
  formConfig() {
    this.pendingForm = this.formBuilder.group({
      startDate: ['', [Validators.required, Validators.maxLength(250)]],
      hours: ['', [Validators.required, Validators.maxLength(250)]],
      minutes: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      collaborators: [''],
      modality: ['', [Validators.required, Validators.maxLength(250)]],
      status: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  /**
   * Sets some values for the form controls
   */
  formValues() {
    this.pendingForm.controls.startDate.setValue(this.taskSelected.startDate);
    this.pendingForm.controls.description.setValue(
      this.taskSelected.description,
    );
  }

  /**
   * Load all the collaborators into an array
   */
  loadCollaborators() {
    this.worklogService
      .getCollaborators()
      .subscribe((collaborators) => (this.collaboratorsArray = collaborators));
  }

  /**
   * Loads the existing collaborators on the worklog selected
   */
  existingCollab() {
    this.worklogService
      .getCollabWork(this.taskSelected.idWorklogDependenciesPk)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        response.forEach((element) => {
          this.workCollaborators.push(element.idUsersFk);
        });
      });
  }

  /**
   * Show a success message with notifications modal
   * @param message
   */
  showSuccess(message) {
    this.isReady = true;
    this.typeSuccess = true;
    this.messageModal = message;
  }
  /**
   * Show a error message with notifications modal
   * @param message
   */
  showError(message) {
    this.isReady = true;
    this.typeSuccess = false;
    this.messageModal = message;
  }
  /**
   * Hides the notification when the timesOut finish
   * @param hide
   */
  handleNotificationEventEmitted(hide: any) {
    this.isReady = hide;
  }
  /**
   * Fills up an array
   * @param value
   */
  fillArray(value) {
    const temp = [];
    let i = 0;
    for (i = 0; i <= value; i++) {
      temp.push(i);
    }
    return temp;
  }
  /**
   * Updates pending task data with the new one
   * @param credencials
   */
  updatePending(credencials: any) {
    let message;
    let endHours = new Date(this.taskSelected.endDate);
    if (credencials.collaborators !== '') {
      credencials.collaborators.push(this.encryptService.desencrypt('idUser'));
    } else {
      credencials.collaborators = [];
      credencials.collaborators.push(this.encryptService.desencrypt('idUser'));
    }
    const collaborators = this.validateCollaborators(credencials.collaborators);
    const spentTime = credencials.hours + '.' + credencials.minutes;
    this.taskSelected.description = credencials.description;
    this.taskSelected.spentTime += Number(spentTime);
    this.taskSelected.endDate = new Date();
    this.taskSelected.startDate = credencials.startDate;
    this.taskSelected.status = credencials.status;
    this.worklogService
      .putPendingTask(this.taskSelected)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response) => {
          if (collaborators.length > 0) {
            collaborators.forEach((idUser) => {
              this.addNewCollaborator(
                idUser,
                this.taskSelected.idWorklogDependenciesPk,
              );
            });
          }
          message = 'success';
          this.onNoClick(message);
        },
        (error) => {
          message = 'Error al modificar la tarea.';
          this.showError(message);
        },
      );
  }

  /**
   * Returns the values of the array which are not on the collaborators work array
   * @param collaborators
   */
  validateCollaborators(collaborators) {
    const arrayCollaborators = this.workCollaborators;
    return collaborators.filter(function (obj) {
      return arrayCollaborators.indexOf(obj) == -1;
    });
  }

  /**
   * adds the new collaborators that are not in the array of work collaborators
   */
  addNewCollaborator(idUser, idWorklog) {
    let message = '';
    this.worklogService
      .postWorklogByUser({
        idUsersFk: idUser,
        idWorklogFk: idWorklog,
      })
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response) => {
          message = 'success';
        },
        (error) => {
          message = 'error';
          this.onNoClick(message);
        },
      );
  }
}
