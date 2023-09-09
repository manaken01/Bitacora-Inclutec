import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { MatDatepickerInputEvent } from "@angular/material";
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { UserService } from "../../../../../services/user.service";
import { WorklogService } from "../../../../../services/worklog.service";
import { DependenciesService } from "../../../../../services/dependecies.service";
import { EncryptService } from "../../../../../services/encrypt.service";
import { CommonConstants } from "../../../../../common/common.constant";
import { LargeNotificationComponent } from "../../../../../utils/large-notification/large-notification.component";

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
  selector: "app-register-modal",
  templateUrl: "./register-modal.component.html",
  styleUrls: ["./register-modal.component.scss"],
  providers: [
    UserService,
    WorklogService,
    DependenciesService,
    EncryptService,
    CommonConstants,
  ],
})
export class RegisterModalComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public registerForm: FormGroup;
  public projectsArray: any;
  public phasesArray: any;
  public activitiesArray: any;
  public taskArray: any;
  public collaboratorsArray: any;
  public accessibility: boolean;
  public hours: any;
  public endHours: any;
  public minutes: any;
  public minDate: Date;
  public isReady: boolean;
  public type: string;
  public message: any;
  public messageModal: string;
  public typeSuccess: boolean;

  /**
   * Register modal constructor
   * @param worklogService
   * @param encryptService
   * @param dialogRef
   * @param formBuilder
   * @param data
   * @param datePipe
   * @param dialog
   */
  constructor(
    private worklogService: WorklogService,
    private encryptService: EncryptService,
    public dialogRef: MatDialogRef<RegisterModalComponent>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.projectsArray = [];
    this.phasesArray = [];
    this.activitiesArray = [];
    this.taskArray = [];
    this.collaboratorsArray = [];
    this.hours = CommonConstants.hours;
    this.endHours = CommonConstants.hours;
    this.minutes = CommonConstants.minutes;
    this.accessibility = false;
    this.minDate = new Date();
  }

  onNoClick(message: string): void {
    this.dialogRef.close(message);
  }

  ngOnInit() {
    this.formConfig();
    this.worklogService
      .getProjectsByUsers(this.encryptService.desencrypt("idUser"))
      .subscribe((projects) => {
        this.projectsArray = projects;
        if (projects.length > 0) {
          this.processTitle();
        } else {
          this.openNotificacition(
            `No hay proyectos vinculados, por favor diríjase a su perfil y solicité colaborar en algún proyecto.`,
            "Sin proyectos",
            "warning"
          );
        }
      });
    this.worklogService
      .getCollaborators()
      .subscribe((collaborators) => (this.collaboratorsArray = collaborators));
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Register form config
   */
  formConfig() {
    this.registerForm = this.formBuilder.group({
      project: ["", [Validators.required, Validators.maxLength(250)]],
      phase: ["", [Validators.required, Validators.maxLength(250)]],
      activity: ["", [Validators.required, Validators.maxLength(250)]],
      task: ["", [Validators.required, Validators.maxLength(250)]],
      state: ["", [Validators.required, Validators.maxLength(250)]],
      modality: ["", [Validators.required, Validators.maxLength(250)]],
      startDate: ["", [Validators.required]],
      startHours: [""],
      startMinutes: [""],
      startFormat: [""],
      endDate: ["", [Validators.required]],
      endHours: [""],
      endMinutes: [""],
      endFormat: [""],
      collaborators: ["", [Validators.maxLength(250)]],
      description: ["", [Validators.required, Validators.maxLength(250)]],
    });
  }

  /**
   * Deletes the html tags of the event title also if the title its different from a new one
   * its means its an recent event, the new spaces and enter spaces are delete and added
   * to an array with the title data.
   */
  processTitle() {
    this.data.title = this.data.title.replace(/<[^>]*>/g, "").trim();
    let titleData;
    let titleElement;
    let message = "";
    if (this.data.title === "accessible") {
      this.accessibility = true;
    } else {
      this.accessibility = false;
      this.registerForm.controls.startDate.setValue(this.data.start);
      if (this.data.end !== undefined) {
        this.registerForm.controls.endDate.setValue(this.data.end);
      } else {
        message = "Por favor arrastre el evento hasta la hora de finalización.";
        this.showError(message);
      }
      if (this.data.title !== "Nuevo registro") {
        titleData = this.data.title.split("\n");
        titleData.forEach((element, index) => {
          element = element.replace(/(\r\n|\n|\r)/gm, "");
          titleElement = element.split("-");
          titleData[index] = titleElement[1];
        });
        this.bindSelects(titleData);
      }
    }
  }

  /**
   * This function gets the data of the titles if the title its not new
   * and with that it starts loading the data like a regular process of filling
   * the form, getting the phases based on the project and the activities based on the phase.
   * @param workData
   */
  bindSelects(workData: any) {
    const project = this.projectsArray.find(
      (project) => project.projectName === workData[0]
    );
    this.registerForm.controls.project.setValue(project.idProjectsPk);
    this.worklogService
      .getPhaseByProjects(project.idProjectsPk)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((phases) => {
        this.phasesArray = phases;
        const phase = this.phasesArray.find(
          (phase) => phase.phaseName === workData[1]
        );
        this.registerForm.controls.phase.setValue(phase.idPhasesPk);
        this.worklogService
          .getActivitiesByPhase(phase.idPhasesPk)
          .pipe(takeUntil(this.onDestroy))
          .subscribe((response) => {
            this.activitiesArray = response;
            const act = this.activitiesArray.find(
              (element) => element.activityName === workData[2].trim()
            );
            this.registerForm.controls.activity.setValue(act.idActivityPk);
            this.worklogService
              .getTasksByActivities(act.idActivityPk)
              .pipe(takeUntil(this.onDestroy))
              .subscribe((tasks) => {
                this.taskArray = tasks;
                const task = this.taskArray.find(
                  (task) => task.taskName === workData[3]
                );
                this.registerForm.controls.task.setValue(task.idTaskPk);
              });
          });
      });
  }

  /**
   * Empty phases, activity, array if the users selects other project
   */
  emptyDependencies() {
    this.phasesArray = [];
    this.activitiesArray = [];
    this.taskArray = [];
  }

  /**
   * Loads the phases of the selected project
   * @param idProject
   */
  onChangeProjects(idProject) {
    this.emptyDependencies();
    this.worklogService.getPhaseByProjects(idProject).subscribe((phases) => {
      this.phasesArray = phases;
      if (phases.length <= 0) {
        this.openNotificacition(
          `Este proyecto no cuenta con Fases.`,
          "Estructura incompleta",
          "warning"
        );
      }
    });
  }

  /**
   * Loads the activities of the selected phase
   * @param idPhase
   */
  onChangePhase(idPhase) {
    this.activitiesArray = [];
    this.taskArray = [];
    this.worklogService.getActivitiesByPhase(idPhase).subscribe((activity) => {
      this.activitiesArray = activity;
      if (activity.length <= 0) {
        this.openNotificacition(
          `Esta fase no cuenta con Actividades.`,
          "Estructura incompleta",
          "warning"
        );
      }
    });
  }
  /*
   * Loads the tasks arrays based on the activity
   */
  onChangeActivity(idActivity) {
    this.taskArray = [];
    this.worklogService.getTasksByActivities(idActivity).subscribe((task) => {
      this.taskArray = task;
      if (task.length <= 0) {
        this.openNotificacition(
          `Esta actividad no cuenta con Tareas.`,
          "Estructura incompleta",
          "warning"
        );
      }
    });
  }

  /**
   * gets the credencials and create a variable with the necessary data to
   * do the post also calling the method to post the worklog info
   * @param credencials
   */
  createDependecies(credencials: any) {
    let message = "";
    if (this.accessibility) {
      this.accessibleTimes(credencials);
    }
    const spentTime = this.getSpentTime(
      credencials.startDate,
      credencials.endDate
    );
    if (credencials.collaborators !== "") {
      const found = credencials.collaborators.find(
        (idUser) => idUser === this.encryptService.desencrypt("idUser")
      );
      if (found === undefined) {
        credencials.collaborators.push(
          this.encryptService.desencrypt("idUser")
        );
      }
    } else {
      credencials.collaborators = [];
      credencials.collaborators.push(this.encryptService.desencrypt("idUser"));
    }
    const dependecies = {
      idWorklogDependenciesPk: 0,
      idProjectsFk: credencials.project,
      idPhaseFk: credencials.phase,
      idActivityFk: credencials.activity,
      idTaskFk: credencials.task,
      startDate: credencials.startDate,
      endDate: credencials.endDate,
      description: credencials.description,
      spentTime: spentTime,
      modality: credencials.modality,
      status: credencials.state,
    };
    this.worklogService
      .postDependencies(dependecies)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response) => {
          credencials.collaborators.forEach((element) => {
            this.createWoklog(element, response.idWorklogDependenciesPk);
          });
          message = "success";
          this.onNoClick(message);
        },
        (error) => {
          message = "error";
          this.onNoClick(message);
        }
      );
  }

  /**
   * Using the credencials and the depencencies id that are parameters given when the dependecies are post
   * this function validates the collaborates first then gets the spent time and create the variable to be posted
   * after that it creates the message and send it to the other component
   * @param credencials
   * @param idDependecies
   */
  createWoklog(idUser: any, idDependecies) {
    const promise = new Promise((resolve) => {
      this.worklogService
        .postWorklogByUser({
          idUsersFk: idUser,
          idWorklogFk: idDependecies,
        })
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
    return promise;
  }

  /**
   * call the other function so the start and end date can be in a valid format
   * @param credencials
   */
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
  /**
   * Sets the new minimum date for the endDate input
   * @param date
   */
  changeDate(date: MatDatepickerInputEvent<Date>) {
    this.minDate = date.value;
  }

  /**
   * Calculates the time spent between dates
   * @param startDate
   * @param endDate
   */
  getSpentTime(startDate, endDate) {
    if (endDate === undefined) {
      endDate = startDate;
    }
    const diffInMs = Date.parse(endDate) - Date.parse(startDate);
    let diffInHours = diffInMs / 1000 / 60 / 60;
    if (diffInHours <= 0) {
      diffInHours = 0;
    }
    return diffInHours;
  }

  /**
   * Process the credencials dates to a valid date
   * @param date
   * @param hours
   * @param minutes
   * @param format
   */
  processDates(date: any, hours: any, minutes: any, format: any) {
    const hour = this.processHour(hours, format);
    date.setHours(hour);
    date.setMinutes(minutes);
    return date;
  }

  /**
   * Process the credencials hours to a valid hour
   * @param hours
   * @param minutes
   * @param format
   */
  processHour(hours, format) {
    let resultHour;
    if (format === "PM") {
      switch (hours) {
        case 1:
          resultHour = "13";
          break;
        case 2:
          resultHour = "14";
          break;
        case 3:
          resultHour = "15";
          break;
        case 4:
          resultHour = "16";
          break;
        case 5:
          resultHour = "17";
          break;
        case 6:
          resultHour = "18";
          break;
        case 7:
          resultHour = "19";
          break;
        case 8:
          resultHour = "20";
          break;
        case 9:
          resultHour = "21";
          break;
        case 10:
          resultHour = "22";
          break;
        case 11:
          resultHour = "23";
          break;
        case 12:
          resultHour = "12";
          break;
        default:
          break;
      }
    } else if (format === "AM") {
      if (hours == 12) {
        resultHour = "00";
      } else {
        resultHour = hours;
      }
    }
    return resultHour;
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

  /**
   * Opens the large notification modal and sends the properties
   * @param message
   * @param title
   * @param type
   */
  openNotificacition(message, title, type) {
    const dialogRef = this.dialog.open(LargeNotificationComponent, {
      width: "650px",
      data: {
        title: title,
        message: message,
        type: type,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
