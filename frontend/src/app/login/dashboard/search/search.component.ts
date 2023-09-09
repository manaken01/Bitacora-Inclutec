import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {WorklogService} from '../../../services/worklog.service';
import {EncryptService} from '../../../services/encrypt.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ListComponent} from './list/list.component';
import {CommonConstants} from '../../../common/common.constant';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [CommonConstants],
})
export class SearchComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public searchForm: FormGroup;
  public projectList: any;
  public phaseList: any;
  public activitiesList: any;
  public searchWorkLogList: any;
  public advanceSearch: boolean;
  public calendarView: boolean;
  public projectId;
  public phaseId;
  public activityId;
  public currentYear: number;
  public currentMonth: number;
  public currentDay: number;
  public currentEndYear: number;
  public currentEndMonth: number;
  public currentEndDay: number;
  public years: any;
  public months: any;
  public days: any;
  public isReady: boolean;
  public type: string;
  public message: string;
  public typeSuccess: boolean;
  public hideTable: boolean;

  @ViewChild(ListComponent, {static: false}) child;

  /**
   * Constructor search
   * @param worklogService
   * @param encryptService
   * @param formBuilder
   */
  constructor(
    private worklogService: WorklogService,
    private encryptService: EncryptService,
    private formBuilder: FormBuilder,
  ) {
    this.hideTable = false;
    this.years = [];
    this.months = [];
    this.searchWorkLogList = [];
    this.projectList = [];
    this.phaseList = [];
    this.activitiesList = [];
    this.advanceSearch = false;
    this.currentYear = 0;
    this.currentEndYear = 0;
    this.currentMonth = 0;
    this.currentEndMonth = 0;
    this.currentDay = 0;
    this.currentEndDay = 0;
  }

  ngOnInit() {
    this.formConfig();
    this.years = CommonConstants.years;
    this.months = CommonConstants.months;
    this.projects();
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth() + 1;
    this.currentDay = currentDate.getDate();
    this.currentEndYear = currentDate.getFullYear();
    this.currentEndMonth = currentDate.getMonth() + 1;
    this.currentEndDay = currentDate.getDate();
    this.getDays(this.currentMonth, this.currentYear);
    this.formSetValues();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngAfterViewInit() {
    this.searchWorkLogList = this.child.searchWorkLogList;
  }

  /**
   * Form configuration
   */
  formConfig() {
    this.searchForm = this.formBuilder.group({
      project: ['', [Validators.required]],
      phase: ['', Validators.required],
      activity: ['', Validators.required],
      yearStart: [''],
      monthStart: [''],
      dayStart: [''],
      yearEnd: [''],
      monthEnd: [''],
      dayEnd: [''],
    });
  }

  /**
   * Sets some values for the from group
   */
  formSetValues() {
    this.searchForm.setValue({
      project: '',
      phase: '',
      activity: '',
      yearStart: this.currentYear,
      monthStart: this.currentMonth,
      dayStart: this.currentDay,
      yearEnd: this.currentEndYear,
      monthEnd: this.currentEndMonth,
      dayEnd: this.currentEndDay,
    });
  }
  /**
   * Gets all project of an user
   */
  projects() {
    this.worklogService
      .getProjectsByUsers(this.encryptService.desencrypt('idUser'))
      .pipe(takeUntil(this.onDestroy))
      .subscribe((projects) => {
        projects.forEach((val) =>
          this.projectList.push(Object.assign({}, val)),
        );
      });
  }

  /**
   * Gets the idProject and name also loads the phases list based on the project selected
   * @param idProject
   * @param projectName
   */
  onChangeProjects(idProject) {
    this.worklogService.getPhaseByProjects(idProject).subscribe((phases) => {
      this.phaseList = phases;
      this.searchForm.controls.phase.setValue(this.phaseList[0].idPhasesPk);
    });
  }

  /**
   * Gets the idPhase and name also loads the activities list based on the phase selected
   * @param idPhase
   * @param phaseName
   */
  onChangePhase(idPhase) {
    this.worklogService.getActivitiesByPhase(idPhase).subscribe((activity) => {
      this.activitiesList = activity;
      this.searchForm.controls.activity.setValue(
        this.activitiesList[0].idActivityPk,
      );
    });
  }

  /**
   * Fills and array with numbers
   * @param value
   */
  fillArray(value) {
    const temp = [];
    for (let i = 6; i <= value; i++) {
      temp.push(i);
    }
    return temp;
  }

  /**
   * Gets the date based on the month and year
   * @param month
   * @param year
   */
  getFullDate(month, year) {
    return new Date(year, month, 0).getDate();
  }

  /**
   * Gets the day based on the month and year
   * @param month
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
   * Changes the days and months based on a year
   * @param value
   */
  onChangeYear(value) {
    this.currentYear = value;
    this.getDays(this.currentMonth, this.currentYear);
  }

  /**
   * Changes the days and months based on a year
   * @param value
   */
  onChangeEndYear(value) {
    this.currentEndYear = value;
    this.getDays(this.currentEndMonth, this.currentEndYear);
  }

  /**
   * Changes the days based on a month selected
   * @param value
   */
  onChangeMonth(value) {
    this.currentMonth = value;
    this.getDays(this.currentMonth, this.currentYear);
  }

  /**
   * Changes the days based on a month selected
   * @param value
   */
  onChangeEndMonth(value) {
    this.currentEndMonth = value;
    this.getDays(this.currentEndMonth, this.currentEndYear);
  }

  /**
   * The advanced search starts at false, if its pressed it turns into true and so on
   */
  advancedSearchActivated() {
    if (this.advanceSearch) {
      this.advanceSearch = false;
    } else {
      this.advanceSearch = true;
    }
  }

  /**
   * Activates or deactivetes the calendar view variable
   */
  calendarViewActivated() {
    if (this.calendarView) {
      this.calendarView = false;
    } else {
      this.calendarView = true;
    }
  }

  /**
   * Change the properties so the app-alert shows up as a success alert
   * @param message
   */
  showSuccess(message) {
    this.isReady = true;
    this.typeSuccess = true;
    this.message = message;
  }
  /**
   * show alert modal error
   * @param message
   */
  showError(message) {
    this.isReady = true;
    this.typeSuccess = false;
    this.message = message;
  }

  /**
   * Hides alert modal after the timeOut goes
   * @param hide
   */
  handleNotificationEventEmitted(hide: any) {
    this.isReady = hide;
  }

  /**
   * Populates worklogList so it can be send with the data filtered to the
   * list component based on the project, phase and activity
   * @param idUser
   * @param idProject
   * @param idPhase
   * @param idActivity
   */
  projectFilterSearch(idUser, idProject, idPhase, idActivity) {
    this.searchWorkLogList = [];
    this.worklogService
      .getWorkLogProjectsFilter(idUser, idProject, idPhase, idActivity)
      .subscribe((worklog) => {
        if (worklog.length != 0) {
          worklog.forEach((val) =>
            this.searchWorkLogList.push(Object.assign({}, val)),
          );
          this.worklogService.changeMessage(this.searchWorkLogList);
          this.hideTable = false;
          const succesMsg = 'Se ha filtrado la información.';
          this.showSuccess(succesMsg);
        } else {
          this.hideTable = true;
          const errorMsg = 'No se ha encontrado información.';
          this.showError(errorMsg);
        }
      });
  }

  /**
   * Does an avanced search this means it filters the worklog not only by the project and relatives
   * it also filters the starts dates of the users worklog
   * @param idUser
   * @param startDate
   * @param endDate
   * @param idProject
   * @param idPhase
   * @param idActivity
   */
  advancedFilterSearch(
    idUser,
    startDate,
    endDate,
    idProject,
    idPhase,
    idActivity,
  ) {
    this.searchWorkLogList = [];
    this.worklogService
      .getAdvancedFilterSearch(
        idUser,
        startDate,
        endDate,
        idProject,
        idPhase,
        idActivity,
      )
      .subscribe((worklog) => {
        if (worklog.length != 0) {
          worklog.forEach((val) =>
            this.searchWorkLogList.push(Object.assign({}, val)),
          );
          this.worklogService.changeMessage(this.searchWorkLogList);
          this.hideTable = false;
          const succesMsg = 'Se han filtrado la información.';
          this.showSuccess(succesMsg);
        } else {
          this.hideTable = true;
          const errorMsg = 'No se ha encontrado información.';
          this.showError(errorMsg);
        }
      });
  }

  /**
   * Gets the form credentials and runs the search filter based on if the advanced search was activated or not
   * @param credencials
   */
  filterSearch(credencials: any) {
    const idUser = this.encryptService.desencrypt('idUser');
    const idProject = credencials.project;
    const idPhase = credencials.phase;
    const idActivity = credencials.activity;
    if (this.advanceSearch) {
      const startDate =
        credencials.yearStart +
        '-' +
        credencials.monthStart +
        '-' +
        credencials.dayStart;
      const endDate =
        credencials.yearEnd +
        '-' +
        credencials.monthEnd +
        '-' +
        credencials.dayEnd;
      this.advancedFilterSearch(
        idUser,
        startDate,
        endDate,
        idProject,
        idPhase,
        idActivity,
      );
    } else {
      this.projectFilterSearch(idUser, idProject, idPhase, idActivity);
    }
  }
}
