import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { WorklogService } from "../../../../services/worklog.service";
import { CommonConstants } from "../../../../common/common.constant";
import { ProjectInfoComponent } from "./project-info/project-info.component";
import { ProjectEditorComponent } from "./project-editor/project-editor.component";

@Component({
  selector: "app-projects-list",
  templateUrl: "./projects-list.component.html",
  styleUrls: ["./projects-list.component.scss"],
  providers: [CommonConstants],
})
export class ProjectsListComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public displayedColumns: string[];
  public projectsList: any;
  public dataSource: any;
  public projectsData: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /**
   * Constructor list
   * @param worklogService
   * @param encryptService
   */
  constructor(
    private worklogService: WorklogService,
    public dialog: MatDialog
  ) {
    this.displayedColumns = CommonConstants.projectsColumns;
    this.projectsList = [];
  }

  ngOnInit() {
    this.getProjectData();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * aplies a filter to the datasource of the table
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Sets the datasource and paginator of the table
   */
  setDataSource(projectDataList) {
    this.dataSource = new MatTableDataSource<any>(projectDataList);
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Gets the structure of the project
   */
  getProjectData() {
    this.worklogService
      .getProjectStructure()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.projectsList = response;
        this.setDataSource(response);
      });
  }

  /**
   * Returns the number of total tasks each phase has
   * @param activities
   */
  numberOftasks(activities) {
    let taskCount = 0;
    activities.forEach((element) => {
      taskCount += element.tasksByActivity;
    });
    return taskCount;
  }

  /**
   * Loads the project info modal
   */
  phaseInfoModal(phase, index, projectName) {
    const dialogRef = this.dialog.open(ProjectInfoComponent, {
      width: "450px",
      data: {
        projectData: phase,
        index: index,
        projectName: projectName,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  /**
   * Loads the project info modal
   */
  projectEditorModal(project) {
    const dialogRef = this.dialog.open(ProjectEditorComponent, {
      width: "550px",
      data: {
        idProjectsPk: project.idProjectsPk,
        projectName: project.projectName,
        status: project.status,
        createdBy: project.createdBy,
        createdAt: project.createdAt,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.getProjectData();
      }
    });
  }
}
