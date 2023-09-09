import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { WorklogService } from "../../../../../services/worklog.service";
import { ProjectsService } from "../../../../../services/projects.service";

@Component({
  selector: "app-confirm-edits",
  templateUrl: "./confirm-edits.component.html",
  styleUrls: ["./confirm-edits.component.scss"],
})
export class ConfirmEditsComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public description: any;

  /**
   * Confirm edit constructor
   * @param ProjectsService
   * @param worklogService
   * @param dialogRef
   * @param data
   */
  constructor(
    private worklogService: WorklogService,
    private projectService: ProjectsService,
    public dialogRef: MatDialogRef<ConfirmEditsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.description = "";
  }

  ngOnInit() {
    this.generateDescription();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onNoClick(message): void {
    this.dialogRef.close(message);
  }

  /**
   * Performs the action either a delete, update or add confirmation
   */
  async performAction() {
    let phase;
    let activity;
    let task;
    switch (this.data.typeElement) {
      case "phase":
        if (this.data.type === "delete") {
          this.deletePhaseByProject({
            idPhase: this.data.value.idPhasesPk,
            idProject: this.data.idProject,
          });
        } else if (this.data.type === "adding") {
          for (const element of this.data.value) {
            phase = await this.createNewPhase(element);
            await this.bindPhaseAndProject(
              this.data.idProject,
              phase.idPhasesPk
            );
          }
          this.onNoClick("success");
        } else {
          for (const element of this.data.value) {
            await this.updatePhaseData(element);
          }
          this.onNoClick("success");
        }
        break;
      case "activity":
        if (this.data.type === "delete") {
          this.deleteActivityByPhase({
            idActivity: this.data.value.idActivityPk,
            idPhase: this.data.binding.idPhase,
          });
        } else if (this.data.type === "adding") {
          for (const element of this.data.value) {
            activity = await this.createNewActivity(element);
            await this.bindActivityAndPhase(
              activity.idActivityPk,
              this.data.binding.idPhase
            );
          }
          this.onNoClick("success");
        } else {
          for (const element of this.data.value) {
            await this.updateActivityData(element);
          }
          this.onNoClick("success");
        }
        break;
      case "task":
        if (this.data.type === "delete") {
          this.deleteTaskByActivity({
            idTask: this.data.value.idTaskPk,
            idActivity: this.data.binding.idActivity,
          });
        } else if (this.data.type === "adding") {
          for (const element of this.data.value) {
            task = await this.createNewTask(element);
            await this.bindTaskAndActivity(
              task.idTaskPk,
              this.data.binding.idActivity
            );
          }
          this.onNoClick("success");
        } else {
          for (const element of this.data.value) {
            await this.updateTaskData(element);
          }
          this.onNoClick("success");
        }
        break;
      default:
        break;
    }
  }

  /**
   * Create a new phase and bind's it to a project
   * @param phaseName
   * @param idProjectsPk
   */
  createNewPhase(phaseName) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postPhase(phaseName)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });

    return promise;
  }

  /**
   * Creates a post to PhasesByProjects binding them
   * @param project
   * @param phase
   */
  bindPhaseAndProject(project: any, phase: any) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postPhaseByProject(phase, project)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
    return promise;
  }

  /**
   * Create a new activity and bind's it to a phase
   * @param activity
   * @param idPhasesPk
   */
  createNewActivity(activity) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postActivity(activity)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
    return promise;
  }

  /**
   * Creates a post to PhasesByProjects binding them
   * @param project
   * @param phase
   */
  bindActivityAndPhase(activity: any, idPhasesPk: any) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postActivityByPhases(activity, idPhasesPk)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
    return promise;
  }

  /**
   * Create a new tast
   * @param task
   */
  createNewTask(task) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postTask(task)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
    return promise;
  }

  /**
   * Creates a post to TaskByActivty binding them
   * @param task
   * @param activity
   */
  bindTaskAndActivity(task: any, activity: any) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postTaskByActivities(activity, task)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
    return promise;
  }

  /**
   * Deletes the binding between a phase and a project
   * @param body
   */
  deletePhaseByProject(body) {
    this.worklogService
      .deletePhaseByProject(body)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (result) => {
          this.onNoClick("success");
        },
        (error) => {
          this.onNoClick("error");
        }
      );
  }

  /**
   * Deletes the binding between an activity and a phase
   * @param body
   */
  deleteActivityByPhase(body) {
    this.worklogService
      .deleteActivityByPhase(body)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (result) => {
          this.onNoClick("success");
        },
        (error) => {
          this.onNoClick("error");
        }
      );
  }

  /**
   * Deletes the binding between an activity and a task
   * @param body
   */
  deleteTaskByActivity(body) {
    this.worklogService
      .deleteTaskByActivity(body)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (result) => {
          this.onNoClick("success");
        },
        (error) => {
          this.onNoClick("error");
        }
      );
  }

  /**
   * Updates the name of the old phase with the new name
   */
  updatePhaseData(element) {
    element.oldData.phaseName = element.newName;
    const promise = new Promise((resolve) => {
      this.projectService
        .putPhaseInfo(element.oldData)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
    return promise;
  }

  /**
   *  Updates the name of the old activity with the new name
   */
  updateActivityData(element) {
    element.oldData.activityName = element.newName;
    const promise = new Promise((resolve) => {
      this.projectService
        .putActivityInfo(element.oldData)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
    return promise;
  }

  /**
   *  Updates the name of the old task with the new name
   */
  updateTaskData(element) {
    element.oldData.taskName = element.newName;
    const promise = new Promise((resolve) => {
      this.projectService
        .putTaskInfo(element.oldData)
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
    return promise;
  }

  /**
   * Generates the body description of the modal
   */
  generateDescription() {
    let elementInfo;
    switch (this.data.type) {
      case "delete":
        elementInfo = this.validateTypeElement(
          this.data.value,
          this.data.typeElement,
          "delete"
        );
        this.description = `¿Desea eliminar la ${elementInfo.type} ${elementInfo.name} en el proyecto ${this.data.projectName}?`;
        break;
      case "adding":
        elementInfo = this.validateTypeElement(
          this.data.value,
          this.data.typeElement,
          "adding"
        );
        this.description = `¿Desea agregar las ${elementInfo} `;
        this.data.value.forEach((element) => {
          this.description += `${element}, `;
        });
        this.description += `al proyecto ${this.data.projectName}?`;
        break;
      case "update":
        elementInfo = this.validateTypeElement(
          this.data.value,
          this.data.typeElement,
          "update"
        );
        this.description = `¿Desea modificar el nombre de las ${elementInfo} `;
        this.data.value.forEach((element) => {
          this.description += `${element.oldName}, `;
        });
        this.description += `a `;
        this.data.value.forEach((element) => {
          this.description += `${element.newName}, `;
        });
        this.description += `del proyecto ${this.data.projectName}?`;
        break;
      default:
        break;
    }
  }

  /**
   * Validates which type of element its been given.
   * @param element
   * @param type
   */
  validateTypeElement(element, type, action) {
    let itemType;
    switch (type) {
      case "phase":
        if (action == "delete") {
          itemType = {
            name: element.phaseName,
            type: "Fase",
          };
        } else {
          itemType = "Fases";
        }
        break;
      case "activity":
        if (action == "delete") {
          itemType = {
            name: element.activityName,
            type: "Actividad",
          };
        } else {
          itemType = "Actividades";
        }
        break;
      case "task":
        if (action == "delete") {
          itemType = {
            name: element.taskName,
            type: "Tarea",
          };
        } else {
          itemType = "Tareas";
        }
        break;
      default:
        break;
    }
    return itemType;
  }
}
