import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { registerUser } from "../models/registerUser.model";
import { ToDoModel } from "../models/toDo.model";
import { PendingModel } from "../models/pending.model";
import {
  PostDependencies,
  PostWorklog,
  WorkTODO,
  SearchWorkLog,
  GraphWork,
} from "../models/worklog.model";
import { IAppConfig, APP_CONFIG } from "../../app.config";
import { BehaviorSubject } from "rxjs";
import { retry } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
const headers = new HttpHeaders().set("Content-Type", "application/json");

@Injectable()
export class WorklogService {
  private messageSource = new BehaviorSubject(SearchWorkLog);
  currentMessage = this.messageSource.asObservable();

  changeMessage(work) {
    this.messageSource.next(work);
  }

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) {}

  /**
   * Gets user's workToDo by category 1 meaning its important and 0 its not important same goes for urgent
   * @param idUser
   * @param urgent
   * @param important
   */
  getWorkToDoCategory(
    idUser: any,
    urgent: any,
    important: any
  ): Observable<ToDoModel> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorkToDos/allToDoPerUser`;
    const params = new HttpParams()
      .set("idUser", idUser.toString())
      .set("urgent", urgent.toString())
      .set("important", important.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<ToDoModel>(url, options).pipe(
      tap((indicator: ToDoModel) => {}),
      catchError(this.handleError<ToDoModel>())
    );
  }
  /**
   * Gets all user's pending work
   * @param idUser
   */
  getWorklogPendings(idUser: any): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/allWorklogsPending`;
    const params = new HttpParams().set("idUser", idUser.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets all user's pending work filter by Date
   * @param idUser
   */
  getWorklogPendingsDate(idUser: any, startDate: Date): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/allWorklogsPendingDate`;
    const params = new HttpParams().set("idUser", idUser.toString()).set("startDate",startDate.toISOString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets all projects
   * @param idUser
   */
  getAllProjects(): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects`;
    return this.http.get<PendingModel[]>(url).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets all projects an users its register on and the projects being active
   * @param idUser
   */
  getProjectsByUsers(idUser: any): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}ProjectsByUsers/projectsByUser`;
    const params = new HttpParams().set("idUser", idUser.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets all projects an users its register on even the inactive ones
   * @param idUser
   */
  getAllUserProjects(idUser: any): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}ProjectsByUsers/allUserProjects`;
    const params = new HttpParams().set("idUser", idUser.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets all projects of an user and the colors related to the project
   * @param idUser
   */
  getProjectsAndColors(idUser: any): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}ProjectsColors/projectsColors`;
    const params = new HttpParams().set("idUser", idUser.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets all phases of a project based on the projects id
   * @param idProject
   */
  getPhaseByProjects(idProject: any): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}PhaseByProjects/phasesByProject`;
    const params = new HttpParams().set("idProject", idProject.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets all activities of a phase based on the phase id
   */
  getActivitiesByPhase(idPhase: any): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}ActivityByPhases/activityByPhase`;
    const params = new HttpParams().set("idPhase", idPhase.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets all tak of a activity based on the id of the activity
   * @param idActivity
   */
  getTasksByActivities(idActivity: any): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}TaskByActivities/taskByActivity`;
    const params = new HttpParams().set("idActivity", idActivity.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets all users
   */
  getCollaborators(): Observable<registerUser[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Users/getCollaborators`;
    return this.http.get<registerUser[]>(url);
  }

  /**
   * Gets the collaborators on a worklog
   * @param idWorklog
   */
  getCollabWork(idWorklog): Observable<any[]> {
    const filter = {
      where: { idWorklogFk: idWorklog },
    };
    const params = new HttpParams().set("filter", JSON.stringify(filter));
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogByUsers`;
    const options = { Headers: headers, params: params };
    return this.http.get<registerUser[]>(url, options);
  }

  /**
   * Gets all users work to do
   * @param idUser
   */
  getSearchWorkLog(idUser): Observable<SearchWorkLog[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogByUsers/getSearchWorkLog?idUser=${idUser}`;
    return this.http.get<SearchWorkLog[]>(url);
  }

  /**
   * Gets filters user data based on the project, phase and activity given
   * @param idUser
   * @param idProject
   * @param idPhase
   * @param idActivity
   */
  getWorkLogProjectsFilter(
    idUser,
    idProject,
    idPhase,
    idActivity
  ): Observable<SearchWorkLog[]> {
    const params = `idUser=${idUser}
    &idProject=${idProject}&idPhase=${idPhase}&idActivity=${idActivity}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogByUsers/getProyectFilter?${params}`;
    return this.http.get<SearchWorkLog[]>(url);
  }

  /**
   * Gets filters user data based on the project, phase and activity given
   * @param idUser
   * @param idProject
   * @param idPhase
   * @param idActivity
   */
  getAdvancedFilterSearch(
    idUser,
    startDate,
    endDate,
    idProject,
    idPhase,
    idActivity
  ): Observable<SearchWorkLog[]> {
    const params = `idUser=${idUser}
    &startDate=${startDate}&endDate=${endDate}&idProject=${idProject}&idPhase=${idPhase}&idActivity=${idActivity}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogByUsers/getDateFilter?${params}`;
    return this.http.get<SearchWorkLog[]>(url);
  }

  getCalendarProjectFilter(idUser, idProject): Observable<SearchWorkLog[]> {
    const params = `idUser=${idUser}
    &idProject=${idProject}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogByUsers/getProyectsCalendarFilter?${params}`;
    return this.http.get<SearchWorkLog[]>(url);
  }

  /**
   * Updates pendings task
   * @param task
   */
  putPendingTask(task: any): Observable<PendingModel> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies`;
    return this.http.put<PendingModel>(url, task);
  }

  /**
   * Post dependencies of a worklog
   * @param dependencies
   */
  postDependencies(dependencies): Observable<PostDependencies> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies`;
    return this.http.post<PostDependencies>(url, dependencies, httpOptions);
  }

  /**
   * Post the information of a worklog
   * @param worklogInfo
   */
  postWorklogByUser(worklogInfo) {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogByUsers`;
    return this.http
      .post(url, worklogInfo, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Post a workToDo task
   * @param workToDo
   */
  postWorkTODO(workToDo): Observable<WorkTODO> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorkToDos`;
    return this.http.post<WorkTODO>(url, workToDo, httpOptions);
  }

  /**
   * Gets most common dependecies of a user
   * @param idUser
   */
  getMostCommonDependencies(idUser: any): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/getMostCommon`;
    const params = new HttpParams().set("userId", idUser.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Gets last 4 worklog dependencies of a user
   * @param idUser
   */
  getLastDependencies(idUser: any): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/getLastDependency`;
    const params = new HttpParams().set("userId", idUser.toString());
    const options = { Headers: headers, params: params };
    return this.http.get<PendingModel[]>(url, options).pipe(
      tap((indicator: PendingModel[]) => {}),
      catchError(this.handleError<PendingModel[]>())
    );
  }

  /**
   * Deletes a toDo task
   * @param workToDo
   */
  deleteWorkTodo(workToDo): Observable<WorkTODO> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorkToDos/${workToDo.idWorkToDo_pk}`;
    return this.http.delete<WorkTODO>(url);
  }

  /**
   * Gets the data to load into the chart with all active projects
   * @param startYear
   */
  getGeneralGraph(startYear, endYear): Observable<GraphWork[]> {
    const params = `startYear=${startYear}&endYear=${endYear}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/getGeneralProjectsGraph?${params}`;
    return this.http.get<GraphWork[]>(url);
  }
  /**
   * Gets the data to load into the chart with the user active projects
   * @param idUser
   * @param startYear
   */
  getPersonalGraph(idUser, startYear, endYear): Observable<GraphWork[]> {
    const params = `userId=${idUser}&startYear=${startYear}&endYear=${endYear}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/getPersonalProjectsGraph?${params}`;
    return this.http.get<GraphWork[]>(url);
  }
  /**
   * Gets the data to load into the chart with all active projects
   * @param startYear
   */
  getFilterGeneralGraph(
    startYear,
    endYear,
    idProject
  ): Observable<GraphWork[]> {
    const params = `startYear=${startYear}&endYear=${endYear}&idProject=${idProject}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/getFilterProjectsGeneralGraph?${params}`;
    return this.http.get<GraphWork[]>(url);
  }
  /**
   * Gets the data to load into the chart with the user active projects
   * @param idUser
   * @param startYear
   */
  getFilterPersonalGraph(
    idUser,
    startYear,
    endYear,
    idProject
  ): Observable<GraphWork[]> {
    const params = `userId=${idUser}&startYear=${startYear}&endYear=${endYear}&idProject=${idProject}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/getFilterPersonalProjectsGraph?${params}`;
    return this.http.get<GraphWork[]>(url);
  }
  /**
   * Gets the total of active collaborators on all projects
   */
  getTotalCollaborators(): Observable<Number> {
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/getTotalUsers`;
    return this.http.get<Number>(url);
  }
  /**
   * Gets the total of active collaborators on a project
   */
  getCollaboratorsPerProject(idProject): Observable<Number> {
    const params = `idProject=${idProject}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}WorklogDependencies/getTotalUsersPerProject?${params}`;
    return this.http.get<Number>(url);
  }
  /**
   * Gets all the projects and its structures
   */
  getProjectStructure(): Observable<any> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects/projectsInfo`;
    return this.http.get<any>(url);
  }
  /**
   * Gets the names of the collaborators on a project
   */
  getProjectCollaborators(idProject): Observable<any> {
    const params = `idProject=${idProject}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects/projectCollaborators?${params}`;
    return this.http.get<any>(url);
  }
  /**
   * Uptades the info of a new project
   */
  putProjectInfo(projectData): Observable<any> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects/${projectData.idProjectsPk}`;
    return this.http.put<any>(url, projectData).pipe(
      tap((indicator: any[]) => {}),
      catchError(this.handleError<any[]>())
    );
  }
  /**
   * Gets the users that are not working in the project
   */
  getOutsideCollaborators(idProject): Observable<any> {
    const params = `idProject=${idProject}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects/outsiteCollaborators?${params}`;
    return this.http.get<any>(url);
  }
  /**
   * Post an user to a project
   * @param body
   */
  postUserByProject(body): Observable<any> {
    const url = `${this.config.API_ENDPOINT_BITACORA}ProjectsByUsers`;
    return this.http.post<any>(url, body, httpOptions).pipe(
      tap((indicator: any[]) => {}),
      catchError(this.handleError<any[]>())
    );
  }
  /**
   * Deletes the binding between an user and a project
   * @param body
   */
  deleteUserByProject(body): Observable<any> {
    const params = `idUser=${body.idUser}&idProject=${body.idProject}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects/deleteUserbyProject?${params}`;
    return this.http.delete<any>(url);
  }
  /**
   * Deletes the binding between a phase and a project
   * @param body
   */
  deletePhaseByProject(body): Observable<any> {
    const params = `idPhase=${body.idPhase}&idProject=${body.idProject}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects/deletePhaseByProject?${params}`;
    return this.http.delete<any>(url);
  }
  /**
   * Deletes the binding between an activity and a phase
   * @param body
   */
  deleteActivityByPhase(body): Observable<any> {
    const params = `idActivity=${body.idActivity}&idPhase=${body.idPhase}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects/deleteActivityByPhase?${params}`;
    return this.http.delete<any>(url);
  }
  /**
   * Deletes the binding between an activity and a task
   * @param body
   */
  deleteTaskByActivity(body): Observable<any> {
    const params = `idTask=${body.idTask}&idActivity=${body.idActivity}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}Projects/deleteTaskByActivity?${params}`;
    return this.http.delete<any>(url);
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
