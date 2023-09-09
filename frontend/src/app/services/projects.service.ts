import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, tap, retry } from "rxjs/operators";
import { IAppConfig, APP_CONFIG } from "../../app.config";
import {
  Project,
  ProjectColors,
  Phase,
  PhaseByProject,
  Activity,
  ActivityByPhase,
  Task,
  TaskByActivity,
} from "../models/projects.model";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
const headers = new HttpHeaders().set("Content-Type", "application/json");

@Injectable()
export class ProjectsService {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) {}

  /**
   * Gets all projects for the administrator
   */
  getAllProjects(): Observable<Project[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects`;
    return this.http.get<Project[]>(url);
  }

  /**
   * Gets all Phases for the administrator
   */
  getAllPhases(): Observable<Phase[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Phases`;
    return this.http.get<Phase[]>(url);
  }

  /**
   * Gets all activities for the administrator
   */
  getAllActivities(): Observable<Activity[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Activities`;
    return this.http.get<Activity[]>(url);
  }

  /**
   * Gets all tasks for the administrator
   */
  getAllTasks(): Observable<Task[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Tasks`;
    return this.http.get<Task[]>(url);
  }

  /**
   * Post a new project
   * @param project
   */
  postProject(project: any, createdBy: any, createdAt): Observable<Project> {
    const params = {
      idProjectsPk: 0,
      projectName: project,
      idUnitsFk: 2,
      status: 0,
      createdAt: createdAt,
      createdBy: createdBy,
    };
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects`;
    return this.http
      .post<Project>(url, params)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Post the colors of the new project
   * @param idProjects
   * @param primaryColor
   * @param secondaryColor
   */
  postColorProject(
    idProjects: any,
    primaryColor: any,
    secondaryColor: any
  ): Observable<ProjectColors> {
    const params = {
      idProjectsFk: idProjects,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
    };
    const url = `${this.config.API_ENDPOINT_BITACORA}ProjectsColors`;
    return this.http
      .post<ProjectColors>(url, params)
      .pipe(retry(1), catchError(this.handleError));
  }
  /**
   * Post a new phase
   * @param phase
   */
  postPhase(phase: any) {
    const params = {
      idPhasesPk: 0,
      phaseName: phase,
      idUnitsFk: 2,
    };
    const url = `${this.config.API_ENDPOINT_BITACORA}Phases`;
    return this.http.post<Phase>(url, params, httpOptions);
  }
  /**
   * Post a new project to an existing project or new project
   * @param phase
   * @param project
   */
  postPhaseByProject(phase: any, project: any) {
    const params = {
      idPhaseFk: phase,
      idProjectsFk: project,
    };
    const url = `${this.config.API_ENDPOINT_BITACORA}PhaseByProjects`;
    return this.http.post<PhaseByProject[]>(url, params, httpOptions);
  }

  /**
   * Post a new activity
   * @param activity
   */
  postActivity(activity: any) {
    const params = {
      idActivityPk: 0,
      activityName: activity,
      idUnitsFk: 2,
    };
    const url = `${this.config.API_ENDPOINT_BITACORA}Activities`;
    return this.http
      .post<Activity>(url, params)
      .pipe(retry(1), catchError(this.handleError));
  }
  /**
   * Post a new activity to an existing phase or new phase
   * @param activity
   * @param phase
   */
  postActivityByPhases(
    activity: any,
    phase: any
  ): Observable<ActivityByPhase[]> {
    const params = {
      idActivityFk: activity,
      idPhasesFk: phase,
    };
    const url = `${this.config.API_ENDPOINT_BITACORA}ActivityByPhases`;
    return this.http
      .post<ActivityByPhase[]>(url, params)
      .pipe(retry(1), catchError(this.handleError));
  }
  /**
   * Post a new task
   * @param activity
   */
  postTask(task: any): Observable<Task> {
    const params = {
      idTaskPk: 0,
      taskName: task,
      idUnitsFk: 2,
    };
    const url = `${this.config.API_ENDPOINT_BITACORA}Tasks`;
    return this.http
      .post<Task>(url, params)
      .pipe(retry(1), catchError(this.handleError));
  }
  /**
   * Post a new task to an existing activity or new activity
   * @param activity
   * @param task
   */
  postTaskByActivities(activity: any, task: any): Observable<TaskByActivity[]> {
    const params = {
      idActivityFk: activity,
      idTaskFk: task,
    };
    const url = `${this.config.API_ENDPOINT_BITACORA}TaskByActivities`;
    return this.http
      .post<TaskByActivity[]>(url, params)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * updates the data of an existing phase
   * @param phaseData
   */
  putPhaseInfo(phaseData): Observable<any> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Phases/${phaseData.idPhasesPk}`;
    return this.http.put<any>(url, phaseData).pipe(
      tap((indicator: any[]) => {}),
      catchError(this.handleError<any[]>())
    );
  }

  /**
   * updates the data of an existing activity
   * @param activityData
   */
  putActivityInfo(activityData): Observable<any> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Activities/${activityData.idActivityPk}`;
    return this.http.put<any>(url, activityData).pipe(
      tap((indicator: any[]) => {}),
      catchError(this.handleError<any[]>())
    );
  }

  /**
   * updates the data of an existing task
   * @param taskData
   */
  putTaskInfo(taskData): Observable<any> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Tasks/${taskData.idTaskPk}`;
    return this.http.put<any>(url, taskData).pipe(
      tap((indicator: any[]) => {}),
      catchError(this.handleError<any[]>())
    );
  }

  /**
   * Error handler
   * @param operation
   * @param result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return error;
    };
  }
}
