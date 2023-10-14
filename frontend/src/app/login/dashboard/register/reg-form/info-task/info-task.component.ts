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
    this.formConfig(); // Agregar esta línea para configurar el formulario
    this.registerForm.controls.startDate.setValue(this.data.start);
    const startDate = this.data.start;
    let projectsList: PendingModel[];
   
    
    let xList: PendingModel[];
    
    this.worklogService.getWorklogPendings(idUser).subscribe((x) => {
      this.worklogService.getProjectsByUsers(idUser).subscribe(
        (data) => {
          // La variable 'data' contiene los datos que devuelve el servicio
          projectsList = data; // Guarda los datos en la lista
          xList = x
          for (let j = 0; j < xList.length; j++) {
            for (let i = 0; i < projectsList.length; i++) {
              console.log(xList[j].idProjectsFk)
              if (xList[j].idProjectsFk == projectsList[i].idProjectsPk) {
                xList[j].projectName = projectsList[i].projectName
              }
            }
          }
          this.list =  x.filter(item => item.startDate == startDate.toISOString());

          this.loading = false;
      });
      
    });
    
    
  }

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

  /**
 * This function processes the provided hours, minutes, and format to create a valid date.
 * @param date Date to process.
 * @param hours Hours to set.
 * @param minutes Minutes to set.
 * @param format Format (AM or PM) for the time.
 */
processDates(date: any, hours: any, minutes: any, format: any) {
  const hour = this.processHour(hours, format);
  date.setHours(hour);
  date.setMinutes(minutes);
  return date;
}

/**
 * This function processes the hours and returns a valid 24-hour format hour.
 * @param hours Hours to process.
 * @param format Format (AM or PM) for the time.
 */
processHour(hours, format) {
  let resultHour;
  if (format === "PM") {
    switch (hours) {
      case 1:
        resultHour = 13;
        break;
      case 2:
        resultHour = 14;
        break;
      case 3:
        resultHour = 15;
        break;
      case 4:
        resultHour = 16;
        break;
      case 5:
        resultHour = 17;
        break;
      case 6:
        resultHour = 18;
        break;
      case 7:
        resultHour = 19;
        break;
      case 8:
        resultHour = 20;
        break;
      case 9:
        resultHour = 21;
        break;
      case 10:
        resultHour = 22;
        break;
      case 11:
        resultHour = 23;
        break;
      case 12:
        resultHour = 12;
        break;
      default:
        break;
    }
  } else if (format === "AM") {
    if (hours == 12) {
      resultHour = 0;
    } else {
      resultHour = hours;
    }
  }
  return resultHour;
}

accessibleTimes(credencials: any) {
  credencials.startDate = this.processDates(
    credencials.startDate,
    credencials.startHours,
    credencials.startMinutes,
    credencials.startFormat
  );
  credencials.endDate = this.processDates(
    credencials.endDate,
    credencials.endHours,
    credencials.endMinutes,
    credencials.endFormat
  );
}

}
