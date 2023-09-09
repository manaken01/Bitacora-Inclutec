import { Component, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { NewTaskService } from "../../../utils/new-task/new-task.service";
import { WorklogService } from "./../../../services/worklog.service";
import { EncryptService } from "../../../services/encrypt.service";
import { ToDoModel } from "../../../models/toDo.model";
@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.scss"],
  providers: [WorklogService, EncryptService, NewTaskService],
})
export class TasksComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public alert;
  public resultsWorkToDo: any;
  public isCollapsed1: boolean;
  public isCollapsed2: boolean;
  public isCollapsed3: boolean;
  public isCollapsed4: boolean;

  public resultsImportantUrgent: any;
  public resultsImportantNoUrgent: any;
  public resultsNoImportantUrgent: any;
  public resultsNoImportantNoUrgent: any;

  constructor(
    private worklogService: WorklogService,
    private encryptService: EncryptService,
    private newTaskService: NewTaskService
  ) {
    this.isCollapsed1 = true;
    this.isCollapsed2 = true;
    this.isCollapsed3 = true;
    this.isCollapsed4 = true;

    this.resultsWorkToDo = [];

    this.resultsImportantUrgent = [];
    this.resultsImportantNoUrgent = [];
    this.resultsNoImportantUrgent = [];
    this.resultsNoImportantNoUrgent = [];
  }

  ngOnInit() {
    const idUser = this.encryptService.desencrypt("idUser");
    this.worklogService
      .getWorkToDoCategory(idUser, 1, 1)
      .subscribe(res => (this.resultsImportantUrgent = res));
    this.worklogService
      .getWorkToDoCategory(idUser, 0, 1)
      .subscribe(res => (this.resultsImportantNoUrgent = res));
    this.worklogService
      .getWorkToDoCategory(idUser, 1, 0)
      .subscribe(res => (this.resultsNoImportantUrgent = res));
    this.worklogService
      .getWorkToDoCategory(idUser, 0, 0)
      .subscribe(res => (this.resultsNoImportantNoUrgent = res));
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Calls the modals services and sends the idUsers
   */
  newTask() {
    const idUser = this.encryptService.desencrypt("idUser");
    this.newTaskService.alertThis(idUser, () => { });
  }

  /**
   * Gets the the element to delete from a list sets alert to 1 so an alert
   * its trigger and tells the screen reader an element has been delete
   * @param todo
   */
  deleteTodo(todo: ToDoModel) {
    this.alert = 0;
    this.worklogService
      .deleteWorkTodo(todo)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        response => {
          this.ngOnInit();
          this.alert = 1;
        },
        error => {
          error;
        }
      );
  }
}
