/**
 * Info task, new functionality. Loads the worklogs pending of the user in the calendar
 */
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { WorklogService } from "../../../../../services/worklog.service";
import { PendingModel } from "../../../../../models/pending.model";
import { EncryptService } from "../../../../../services/encrypt.service";
import { RegisterPendingService } from "../../../../../utils/register-pending/register-pending.service";
import { RegisterPendingComponent } from "../../../../../utils/register-pending/register-pending.component";
import { MatDatepickerInputEvent } from "@angular/material";
import { CommonConstants } from "../../../../../common/common.constant";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

export interface DialogData {
  start: any;
  end: any;
  title: string;
  id: any;
}

@Component({
  selector: 'app-info-task',
  templateUrl: './info-task.component.html',
  styleUrls: ['./info-task.component.scss'],
  providers: [WorklogService, EncryptService, RegisterPendingService],
})
export class InfoTaskComponent implements OnInit {
  public registerForm: FormGroup;
  public list: PendingModel[];
  public loading: boolean;
  public loadingCount: number;
  public minDate: Date;
  public accessibility: boolean;
  public hours: any;
  public endHours: any;
  public minutes: any;
  /**
   * Pending component constructor
   * @param worklogService
   * @param encryptService
   * @param dialog
   */
  constructor(
    private worklogService: WorklogService,
    private encryptService: EncryptService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {this.hours = CommonConstants.hours;
    this.endHours = CommonConstants.hours;
    this.minutes = CommonConstants.minutes;
    this.accessibility = false;
    this.minDate = new Date();
  }

  ngOnInit() {
    const idUser = this.encryptService.desencrypt("idUser");
    this.loading = true;
    this.formConfig(); // This line loads the form
    this.registerForm.controls.startDate.setValue(this.data.start); //Sets the day
    const startDate = this.data.start;
    let projectsList: PendingModel[];
    let xList: PendingModel[];
    /**
   * Info task, new functionality. Loads the worklogs pending of the user in the calendar
   * Search the name of the projects to shown them
   */
    this.worklogService.getWorklogPendings(idUser).subscribe((x) => {
      this.worklogService.getProjectsByUsers(idUser).subscribe(
        (data) => {
          // Data have the data of the request
          projectsList = data; // Save the data
          xList = x
          for (let j = 0; j < xList.length; j++) {
            for (let i = 0; i < projectsList.length; i++) {
              if (xList[j].idProjectsFk == projectsList[i].idProjectsPk) {
                xList[j].projectName = projectsList[i].projectName
              }
            }
          }
          /**
           * Info task, new functionality. Loads the worklogs pending of the user in the calendar
           * Filter the registers by hours
           */
          this.list =  x.filter(item => item.startDate == startDate.toISOString());
          this.loading = false;
      });
    });
  }

  /**
   * Set the values of the form
   */
  formConfig() {
    this.registerForm = this.formBuilder.group({
      startDate: [""],
      startHours: [""],
      startMinutes: [""],
      startFormat: [""]
    });
  }

  /**
   * Sets the new minimum date for the endDate input
   * @param date
   */
  changeDate(date: MatDatepickerInputEvent<Date>) {
    this.minDate = date.value;
  }

  /**
   * Opens the register pending modal
   * @param pendingTask
   */
  registerModal(pendingTask: any) {
    this.registerForm.controls.startDate.setValue(this.data.start);
    const dialogRef = this.dialog.open(RegisterPendingComponent, {
      width: "550px",
      data: {
        event: pendingTask,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.ngOnInit();
      }
    });
  }


}
