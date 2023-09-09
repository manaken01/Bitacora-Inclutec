import { Component, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarView,
  DAYS_OF_WEEK,
} from "angular-calendar";
import { startOfDay, endOfDay, isSameDay, isSameMonth } from "date-fns";
import { EncryptService } from "../../../../services/encrypt.service";
import { WorklogService } from "../../../../services/worklog.service";
import { CommonConstants } from "../../../../common/common.constant";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  providers: [CommonConstants],
})
export class CalendarComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public monthsNames: any;
  public monthSelected: string;
  public test: string;
  public searchWorkLogList: any;
  public projectList: any;
  public totalHours: any;
  public hoursPerMonth: any;
  public view: CalendarView;
  public viewDate: Date;
  public locale: string;
  public activeDayIsOpen: boolean;
  public events: CalendarEvent[];
  public excludeDays: number[];
  public weekStartsOn: number;
  public weekendDays: number[];
  public CalendarView: any;
  public monthToShow: number;
  private yearToShow: number;
  public refreshCalendar: Subject<any> = new Subject();

  /**
   * Calendar constructor
   * @param worklogService
   * @param encryptService
   */
  constructor(
    private worklogService: WorklogService,
    private encryptService: EncryptService
  ) {
    this.searchWorkLogList = [];
    this.projectList = [];
    this.totalHours = 0;
    this.hoursPerMonth = 0;
    this.view = CalendarView.Month;
    this.viewDate = new Date();
    this.locale = "es";
    this.activeDayIsOpen = false;
    this.weekStartsOn = DAYS_OF_WEEK.MONDAY;
    this.weekendDays = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
    this.CalendarView = CalendarView;
    this.excludeDays = [0, 6];
    this.monthToShow = this.viewDate.getMonth() + 1;
    this.yearToShow = this.viewDate.getFullYear();
    this.events = [];
    this.monthsNames = CommonConstants.monthsNames;
    this.monthSelected = "";
    this.test = "";
  }

  ngOnInit() {
    this.getProjects();
    this.getAppoiments();
    this.worklogService.currentMessage.subscribe((message) => {
      if (message.length > 0) {
        this.searchWorkLogList = message;
        this.calculateTotalHours(this.searchWorkLogList);
        this.calculateHoursMonth(this.searchWorkLogList);
        this.processAppoiments(this.searchWorkLogList);
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Changes the view of the calendar
   * @param view
   */
  setView(view: CalendarView) {
    this.view = view;
  }

  /**
   * Changes the calendar view to a day view
   * @param date
   */
  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }
  /**
   * Changes the calendar view to a week view
   * @param date
   */
  changeWeek(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Week;
  }

  /**
   * Sets the result of the services to the array search worklist
   */
  getAppoiments() {
    this.searchWorkLogList = [];
    this.totalHours = 0;
    const idUser = this.encryptService.desencrypt("idUser");
    this.worklogService
      .getSearchWorkLog(idUser)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        if (this.searchWorkLogList.length == 0) {
          this.searchWorkLogList = response;
          response.forEach((val) => {
            this.totalHours += val.spentTime;
          });
          this.totalHours = (Math.round(this.totalHours * 100) / 100).toFixed(
            2
          );
          this.processAppoiments(this.searchWorkLogList);
          this.calculateHoursMonth(this.searchWorkLogList);
        }
      });
  }

  /**
   * Gets the worklog list and iterates through it  while setting the events configuration
   * @param resultOfRequest
   */
  processAppoiments(resultOfRequest: any) {
    let appoinmentDate = null;
    let appoinmnetEnd = null;
    let colors;
    this.events = [];
    resultOfRequest.map((appoiment) => {
      this.projectList.forEach((project) => {
        if (project.projectName == appoiment.projectName) {
          colors = {
            primary: project.primaryColor,
            secondary: project.secondaryColor,
          };
        }
      });
      appoinmentDate = new Date(appoiment.startDate);
      appoinmnetEnd = new Date(appoiment.endDate);
      this.events = [
        ...this.events,
        {
          id: appoiment.Requests_pk,
          start: appoinmentDate,
          end: appoinmnetEnd,
          title:
            appoiment.projectName +
            " Tarea: " +
            appoiment.taskName +
            " Duración: " +
            appoiment.spentTime +
            " horas",
          color: colors,
        },
      ];
    });
    this.refreshCalendar.next();
  }

  /**
   * Changes the view of the calendar to the next month
   */
  advanceMonthView(): void {
    this.monthSelected = null;
    if (this.view === CalendarView.Month) {
      if (this.monthToShow == 12) {
        this.monthToShow = 1;
        this.yearToShow++;
        this.monthSelected =
          this.formMonthDate(this.monthToShow) + " " + this.yearToShow;
        this.calculateHoursMonth(this.searchWorkLogList);
      } else {
        this.monthToShow += 1;
        this.monthSelected =
          this.formMonthDate(this.monthToShow) + " " + this.yearToShow;
        this.calculateHoursMonth(this.searchWorkLogList);
      }
    }
  }

  /**
   * Changes the view of the calendar to the pass month
   */
  delayMonthView(): void {
    if (this.view === CalendarView.Month) {
      if (this.monthToShow == 1) {
        this.monthToShow = 12;
        this.yearToShow--;
        this.monthSelected =
          this.formMonthDate(this.monthToShow) + " " + this.yearToShow;
        this.calculateHoursMonth(this.searchWorkLogList);
      } else {
        this.monthToShow -= 1;
        this.monthSelected =
          this.formMonthDate(this.monthToShow) + " " + this.yearToShow;
        this.calculateHoursMonth(this.searchWorkLogList);
      }
    }
  }

  /**
   * Gets the number of the month and return the name
   * @param monthNumber
   */
  formMonthDate(monthNumber: number) {
    return this.monthsNames[monthNumber - 1];
  }

  /**
   * Calculates the total of hourse using the pending time of the woklog
   * @param searchWorkLogList
   */
  calculateTotalHours(searchWorkLogList) {
    this.totalHours = 0;
    searchWorkLogList.forEach((val) => {
      this.totalHours += val.spentTime;
    });
    this.totalHours = (Math.round(this.totalHours * 100) / 100).toFixed(2);
  }
  /**
   * Calculates the hours per month based on the worklog list and the month showing
   */
  calculateHoursMonth(searchWorkLogList) {
    this.hoursPerMonth = 0;
    searchWorkLogList.forEach((element) => {
      let startDate = new Date(element.startDate);
      let month = startDate.getMonth() + 1;
      if (month == this.monthToShow) {
        this.hoursPerMonth += element.spentTime;
      }
    });
    this.hoursPerMonth = (Math.round(this.hoursPerMonth * 100) / 100).toFixed(
      2
    );
  }

  /**
   * Gets all the users projects
   */
  getProjects() {
    const idUser = this.encryptService.desencrypt("idUser");
    this.worklogService
      .getProjectsAndColors(idUser)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.projectList = response;
      });
  }

  /**
   * Filters the worklog of the user based on the selected project of the list
   * @param project
   */
  filterProject(project: any) {
    this.totalHours = 0;
    this.searchWorkLogList = [];
    const idUser = this.encryptService.desencrypt("idUser");
    this.worklogService
      .getCalendarProjectFilter(idUser, project)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        if (this.searchWorkLogList == 0) {
          this.searchWorkLogList = response;
          response.forEach((val) => {
            this.totalHours += val.spentTime;
          });
          this.totalHours = (Math.round(this.totalHours * 100) / 100).toFixed(
            2
          );
          this.processAppoiments(this.searchWorkLogList);
          this.calculateHoursMonth(this.searchWorkLogList);
        }
      });
  }
}
