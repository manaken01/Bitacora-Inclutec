import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { UserService } from "../../../../services/user.service";
import { WorklogService } from "../../../../services/worklog.service";
import { DependenciesService } from "../../../../services/dependecies.service";
import { Subject, fromEvent } from "rxjs";
import { ContributorsModel } from "../../../../models/user.model";
import { EncryptService } from "../../../../services/encrypt.service";
import {
  CalendarEvent,
  CalendarView,
  CalendarEventTimesChangedEvent,
} from "angular-calendar";
import { WeekViewHourSegment } from "calendar-utils";
import { CommonConstants } from "../../../../common/common.constant";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { RegisterModalComponent } from "./register-modal/register-modal.component";
import { endOfWeek, addDays, addMinutes } from "date-fns";
import { finalize, takeUntil } from "rxjs/operators";
import { InfoTaskComponent } from "./info-task/info-task.component";
import { start } from "repl";



export interface DialogData {
  start: any;
  end: any;
  title: string;
  id: any;
}

@Component({
  selector: "app-reg-form",
  templateUrl: "./reg-form.component.html",
  styleUrls: ["./reg-form.component.scss"],
  providers: [
    UserService,
    WorklogService,
    DependenciesService,
    EncryptService,
    CommonConstants,
  ],
})
export class RegFormComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public contributors: ContributorsModel[] = [];
  public dependenciesFk: number;
  public isReady: boolean;
  public type: string;
  public message: any;
  public messageModal: string;
  public typeSuccess: boolean;
  public lastList: any;
  public commonList: any;
  public allList: any;
  public accessibility: boolean;
  public eventsPopulate: CalendarEvent[] = [];
  public view: CalendarView;
  public CalendarView: any;
  public locale: string;
  public viewDate = new Date();
  public events: CalendarEvent[] = [];
  public commonEvents: CalendarEvent[] = [];
  public lastEvents: CalendarEvent[] = [];
  public allEvents: CalendarEvent[] = [];
  public segments: any[] = [];
  public dragToCreateActive = false;
  public weekStartsOn: 0 = 0;
  public activeDayIsOpen = false;

  /**
   * Register form constructor
   * @param worklogService
   * @param encryptService
   * @param dialog
   * @param dependenciesService
   */
  constructor(
    private worklogService: WorklogService,
    private encryptService: EncryptService,
    private userService: UserService,
    public dialog: MatDialog,
    @Inject(DependenciesService) public dependenciesService: DependenciesService
  ) {
    this.view = CalendarView.Month;
    this.locale = "es-CR";
    this.CalendarView = CalendarView;
    this.lastList = [];
    this.commonList = [];
    this.allList = [];
    this.accessibility = false;
  }

  ngOnInit() {
    
    this.worklogService.getWorklogPendings(this.encryptService.desencrypt("idUser")).subscribe((x) => {
    for(let i = 0; i < x.length; i++) {
        const worklog = x[i]; // Supongamos que cada elemento en la lista representa un trabajo o evento
        let startDate = new Date(worklog.startDate);
        const calendarEvent: CalendarEvent = {
            id: x.length,
            title: ``,
            start: startDate,
            end: new Date(worklog.endDate),
            meta: {
              tmpEvent: true,
            },
            color: CommonConstants.CALENDAR_COLORS.green,
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            actions: [
              {
                label: '<i class="fas fa-trash text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.events = this.events.filter((iEvent) => iEvent !== event);
                },
              },
              {
                label: '<i class="fas fa-edit text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.openDialog(event);
                },
              },
              {
                label: '<i class="fas fa-copy text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.copyEvent(event);
                },
              },
              {
                label: '<i class="fas fa-info-circle text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.openDialogTask(event);
                },
              },
            ],
        };
        this.events.push(calendarEvent);
      }
      this.refresh.next(); // Actualiza la vista
    });

    this.commonWorklog();
    this.lastestWorklog();
    this.ValidateAccessibility();
    
  }

  
  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

 
  /**
   * Looks up for any disability linked to this user
   */
  ValidateAccessibility() {
    const idUser = this.encryptService.desencrypt("idUser");
    this.userService
      .validateUserDisabilities(idUser)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        if (response.length > 0) {
          this.accessibility = true;
        }
      });
  }

  /**
   * Changes so the modals can be open as a accessible modal
   */
  accessibleModal() {
    let message = "";
    const title = "accessible";
    const dialogRef = this.dialog.open(RegisterModalComponent, {
      width: "650px",
      data: {
        title: title,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        message = "Se registro correctamente la tarea!";
        this.showSuccess(message);
      } else if (result === "error") {
        message = "Error al registrar la tarea";
        this.showError(message);
      }
    });
  }
  /**
   * Loads the most commong worklog into an array of events
   */
  commonWorklog() {
    this.worklogService
      .getMostCommonDependencies(this.encryptService.desencrypt("idUser"))
      .subscribe((commonWorklogs) => {
        this.commonList = commonWorklogs;
        this.commonEvents = [];
        commonWorklogs.forEach((element) => {
          this.commonEvents.push({
            id: this.commonEvents.length,
            title: `${element.projectName} - ${element.taskName}`,
            start: new Date(),
            meta: {
              tmpEvent: true,
            },
            color: CommonConstants.CALENDAR_COLORS.green,
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            actions: [
              {
                label: '<i class="fas fa-trash text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.events = this.events.filter(
                    (iEvent) => iEvent !== event
                  );
                },
              },
              {
                label: '<i class="fas fa-edit text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.openDialog(event);
                },
              },
              {
                label: '<i class="fas fa-copy text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.copyEvent(event);
                },
              },
            ],
          });
        });
      });
  }

  /**
   * Loads the last worklogs into an array of events
   */
  lastestWorklog() {
    this.worklogService
      .getLastDependencies(this.encryptService.desencrypt("idUser"))
      .subscribe((lastestWorklog) => {
        this.lastList = lastestWorklog;
        this.lastEvents = [];
        lastestWorklog.forEach((element) => {
          this.lastEvents.push({
            id: this.lastEvents.length,
            title: `${element.projectName} - ${element.taskName}`,
            start: new Date(),
            meta: {
              tmpEvent: true,
            },
            color: CommonConstants.CALENDAR_COLORS.green,
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            actions: [
              {
                label: '<i class="fas fa-trash text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.events = this.events.filter(
                    (iEvent) => iEvent !== event
                  );
                },
              },
              {
                label: '<i class="fas fa-edit text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.openDialog(event);
                },
              },
              {
                label: '<i class="fas fa-copy text-white ml-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.copyEvent(event);
                },
              },
            ],
          });
        });
      });
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
   * Changes the calendar view to a day view
   * @param date
   */
  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }
  /**
   * Sets the view of the calendar
   * @param view
   */
  setView(view: CalendarView) {
    this.view = view;
  }
  /**
   * Subject that its use to refresh the events
   */
  refresh: Subject<any> = new Subject();
  /**
   *Calculates a number near the bottom or floor
   * @param amount
   * @param precision
   */
  floorToNearest(amount: number, precision: number) {
    return Math.floor(amount / precision) * precision;
  }
  /**
   * Calculates a number near the top or cealing
   * @param amount
   * @param precision
   */
  ceilToNearest(amount: number, precision: number) {
    return Math.ceil(amount / 30) * precision;
  }

  eventsMatch(segment: WeekViewHourSegment,
    event) {

    // Aquí debes implementar tu lógica para comparar las horas del segmento y el evento.
    // Debes devolver true si coinciden, de lo contrario, false.
    // Por ejemplo, si ambos tienen una propiedad 'date', podrías comparar segment.date y event.date.
    return segment.date === event.starDate;
  }
  
  /**
   * Using the segment of the calendar view, the mouse event and html this function first creates
   * the event as a standar event this event its added to the array of events.
   * After that using the mouse event with html activating the dragable to true and setting a new end date.
   * @param segment
   * @param mouseDownEvent
   * @param segmentElement
   */
  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: '<p class="ml-2 text-white">Nuevo registro</p>',
      start: segment.date,
      end: addMinutes(segment.date, 15),
      meta: {
        tmpEvent: true,
      },
      color: CommonConstants.CALENDAR_COLORS.green,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      actions: [
        {
          label: '<i class="fas fa-trash text-white ml-2"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.events = this.events.filter((iEvent) => iEvent !== event);
          },
        },
        {
          label: '<i class="fas fa-edit text-white ml-2"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.openDialog(event);
          },
        },
        {
          label: '<i class="fas fa-copy text-white ml-2"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.copyEvent(event);
          },
        },
        {
          label: '<i class="fas fa-info-circle text-white ml-2"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.openDialogTask(event);
          },
        },
      ],
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });
    fromEvent(document, "mousemove")
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refresh.next();
        }),
        takeUntil(fromEvent(document, "mouseup"))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = this.ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          15
        );

        const daysDiff =
          this.floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refresh.next();
      });
  }


  /**
   * Gets the event which its gonna be copied and creates a push with the same data
   * @param event
   */
  copyEvent(event: CalendarEvent) {
    this.events.push({
      id: this.events.length,
      title: event.title,
      start: event.start,
      end: event.end,
      color: event.color,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      actions: [
        {
          label: '<i class="fas fa-trash text-white ml-2"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.events = this.events.filter((iEvent) => iEvent !== event);
          },
        },
        {
          label: '<i class="fas fa-edit text-white ml-2"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.openDialog(event);
          },
        },
        {
          label: '<i class="fas fa-copy text-white ml-2"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.copyEvent(event);
          },
        },
        {
          label: '<i class="fas fa-info-circle text-white ml-2"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.openDialogTask(event);
          },
        },
      ],
    });
    this.refresh.next();
  }
  /**
   * Adds the common event to the events list adding a new start and end
   * @param param0
   */
  eventCommonDropped({
    event,
    newStart,
    newEnd,
    allDay,
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex = this.commonEvents.indexOf(event);
    const commonEvent = this.commonList[event.id];
    if (typeof allDay !== "undefined") {
      event.allDay = allDay;
    }
    if (externalIndex > -1) {
      this.commonEvents.splice(externalIndex, 1);
      event.title = `<p class='text-center text-white'>
      -${commonEvent.projectName}<br>
      -${commonEvent.phaseName}<br>
      -${commonEvent.activityName} <br>
      -${commonEvent.taskName}<br>
      </p>`;
      this.events.push(event);
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    } else {
      event.end = addMinutes(event.start, 15);
    }

    if (this.view === "month") {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];
    this.commonWorklog();
  }
  /**
   * Adds the lastest event to the events list adding a new start and end
   * @param param0
   */
  eventLatestDropped({
    event,
    newStart,
    newEnd,
    allDay,
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex = this.lastEvents.indexOf(event);
    const lastEvent = this.lastList[event.id];
    if (typeof allDay !== "undefined") {
      event.allDay = allDay;
    }
    if (externalIndex > -1) {
      this.lastEvents.splice(externalIndex, 1);
      event.title = `<p class='text-center text-white'>
      -${lastEvent.projectName}<br>
      -${lastEvent.phaseName}<br>
      -${lastEvent.activityName} <br>
      -${lastEvent.taskName}<br>
      </p>`;
      this.events.push(event);
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    } else {
      event.end = addMinutes(event.start, 15);
    }

    if (this.view === "month") {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];
    this.lastestWorklog();
  }
  /**
   * Opens the dialog and sends the start date and end date of the current event selected
   * @param event
   */
  openDialog(event: CalendarEvent): void {
    let message = "";
    const dialogRef = this.dialog.open(RegisterModalComponent, {
      width: "650px",
      data: {
        start: event.start,
        end: event.end,
        title: event.title,
        id: event.id,
      },
    });


    dialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        message = "Se registro correctamente la tarea!";
        this.refresh.next();
        this.showSuccess(message);
      } else if (result === "error") {
        message = "Error al registrar la tarea";
        this.showError(message);
      }
    });
  }

  openDialogTask(event: CalendarEvent): void {
    let message = "";
    const dialogRef = this.dialog.open(InfoTaskComponent, {
      height: "700px",
      width: "650px",
      data: {
        start: event.start,
        end: event.end,
        title: event.title,
        id: event.id,
      },
    });


    dialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        message = "Se registro correctamente la tarea!";
        this.showSuccess(message);
      } else if (result === "error") {
        message = "Error al registrar la tarea";
        this.showError(message);
      }
    });
  }
  /**
   * Event activated when the size or times of the events change, setting a new start and end date to the event
   * @param param0
   */
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }
  /**
   * Change the properties so the app-notification shows up as a success alert
   * @param message
   */
  showSuccess(message) {
    this.isReady = true;
    this.typeSuccess = true;
    this.messageModal = message;
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
}
