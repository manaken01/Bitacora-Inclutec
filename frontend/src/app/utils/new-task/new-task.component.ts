import { Component, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NewTaskService } from "./new-task.service";
import { WorklogService } from "../../services/worklog.service";
import { EncryptService } from "../../services/encrypt.service";
import { WorkTODO } from "../../models/worklog.model";
import { TasksComponent } from "../../login/dashboard/tasks/tasks.component";

@Component({
  selector: "app-modal-notifications",
  templateUrl: "./new-task.component.html",
  styleUrls: ["./new-task.component.scss"],
  providers: [WorklogService, EncryptService],
})
export class NewTaskComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public taskForm: FormGroup;
  public btnOkText?: string;
  public isReady: boolean;
  public type: string;
  public messageModal: string;
  public typeSuccess: boolean;
  public important;
  public urgent;
  public currentYear = 0;
  public currentMonth = 0;
  public currentDay = 0;
  public years = [
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024,
    2025,
    2026,
    2027,
    2028,
  ];
  public months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public days: any;
  public title: string;
  public message: any;

  /**
   * Constructor new tasks
   * @param alertService
   * @param encryptService
   * @param worklogService
   * @param formBuilder
   * @param taskComponent
   */
  constructor(
    private alertService: NewTaskService,
    private encryptService: EncryptService,
    private worklogService: WorklogService,
    private formBuilder: FormBuilder,
    private taskComponent: TasksComponent
  ) {
    this.important = "Importante";
    this.urgent = "Urgente";
    this.title = "Notificación";
    this.alertService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

  ngOnInit() {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth() + 1;
    this.currentDay = currentDate.getDate();
    this.getDays(this.currentMonth, this.currentYear);
    this.formConfig();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Form settings
   */
  formConfig() {
    this.taskForm = this.formBuilder.group({
      idWorkToDo_pk: [""],
      year: [""],
      month: [""],
      day: [""],
      description: ["", [Validators.required, Validators.maxLength(250)]],
      important: [""],
      urgent: [""],
    });
  }

  /**
   * Post new toDo task
   * @param credencials
   */
  postWorkToDo(credencials: any) {
    if (credencials.important == "") credencials.important = 1;
    if (credencials.urgent == "") credencials.urgent = 1;
    if (credencials.year == "") credencials.year = this.currentYear;
    if (credencials.month == "") credencials.month = this.currentMonth;
    if (credencials.day == "") credencials.day = this.currentDay;
    let message = "";
    const toDoData = credencials as WorkTODO;
    const idUsersFk = this.encryptService.desencrypt("idUser");
    const date =
      credencials.year + "-" + credencials.month + "-" + credencials.day;
    toDoData.idWorkToDo_pk = 0;
    toDoData.idUsersFk = idUsersFk;
    toDoData.toDoDate = date;
    this.worklogService
      .postWorkTODO(toDoData)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        response => {
          this.taskComponent.ngOnInit();
          message = "¡Se registro la tarea!.";
          this.showSuccess(message);
          this.formConfig();
          this.important = "Importante";
          this.urgent = "Urgente";
        },
        error => {
          message = "Error al registrar la tarea.";
          this.showError(message);
        }
      );
  }

  /**
   * Change the properties so the app-alert shows up as a success alert
   * @param message
   */
  showSuccess(message) {
    this.isReady = true;
    this.typeSuccess = true;
    this.messageModal = message;
  }
  /**
   * Change the properties so the app-alert shows up as a success alert
   * @param message
   */
  showError(message) {
    this.isReady = true;
    this.typeSuccess = false;
    this.message = message;
  }
  /**
   * Hides the alert after a period of time based on the setTimeOut
   * @param hide
   */
  handleNotificationEventEmitted(hide: any) {
    this.isReady = hide;
  }

  /**
   * Returns the date
   * @param month
   * @param year
   */
  getFullDate(month, year) {
    return new Date(year, month, 0).getDate();
  }

  /**
   *
   * @param month Returns an array of days depending on the year and month
   * @param year
   */
  getDays(month, year) {
    const temp = [];
    let i = 0;
    for (i = 1; i <= +this.getFullDate(month, year); i++) {
      temp.push(i);
    }
    this.days = temp;
  }

  /**
   * Change days based on the current year and month
   * @param value
   */
  onChangeYear(value) {
    this.currentYear = value;
    this.getDays(this.currentMonth, this.currentYear);
  }

  /**
   * Change days based on the current month selected
   * @param value
   */
  onChangeMonth(value) {
    this.currentMonth = value;
    this.getDays(this.currentMonth, this.currentYear);
  }

  /**
   * Change the important value based on the value its gets fron the radio input
   * @param value
   */
  onChangeImportant(value) {
    if (value == 0) this.important = "No importante";
    if (value == 1) this.important = "Importante";
  }

  /**
   * Change the urgent value based on the value its gets fron the radio input
   * @param value
   */
  onChangeUrgent(value) {
    if (value == 0) this.urgent = "No urgente";
    if (value == 1) this.urgent = "Urgente";
  }
}
