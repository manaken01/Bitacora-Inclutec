import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { WorklogService } from "../../../../../services/worklog.service";

@Component({
  selector: "app-project-info",
  templateUrl: "./project-info.component.html",
  styleUrls: ["./project-info.component.scss"],
})
export class ProjectInfoComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public projectName: string;
  public phaseName: string;
  public phaseIndex: number;
  public activitiesStructure: any;

  constructor(
    private worklogService: WorklogService,
    public dialogRef: MatDialogRef<ProjectInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectName = this.data.projectName;
    this.phaseName = this.data.projectData.phaseName;
    this.phaseIndex = this.data.index;
    this.activitiesStructure = this.data.projectData.activities;
  }

  ngOnInit() {
    this.tasksByActivities();
  }

  onNoClick(message: string): void {
    this.dialogRef.close(message);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Loads the tasks of each activity
   */
  tasksByActivities() {
    this.activitiesStructure.forEach((activity, index) => {
      this.worklogService
        .getTasksByActivities(activity.idActivityPk)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((response) => {
          this.activitiesStructure[index].tasks = response;
        });
    });
  }
}
