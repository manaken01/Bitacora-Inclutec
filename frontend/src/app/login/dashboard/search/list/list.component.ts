import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { WorklogService } from "../../../../services/worklog.service";
import { EncryptService } from "../../../../services/encrypt.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SearchWorkLog } from "../../../../models/worklog.model";
import { CommonConstants } from "../../../../common/common.constant";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  providers: [CommonConstants],
})
export class ListComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public displayedColumns: string[];
  public pageSize: number;
  public dataSource: any;
  public totalHours: any;
  public hoursPerPage: any;
  public pageChanged: boolean;
  public searchWorkLogList: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /**
   * Constructor list
   * @param worklogService
   * @param encryptService
   */
  constructor(
    private worklogService: WorklogService,
    private encryptService: EncryptService
  ) {
    this.displayedColumns = CommonConstants.displayedColumns;
    this.searchWorkLogList = [];
    this.totalHours = 0;
    this.hoursPerPage = 0;
    this.pageChanged = false;
    this.pageSize = 10;
  }

  ngOnInit() {
    this.workLogList();
    this.worklogService.currentMessage.subscribe((message) => {
      if (message.length > 0) {
        this.searchWorkLogList = message;
        this.calculateTotalHours(this.searchWorkLogList);
        this.setDataSource(this.searchWorkLogList);
        const startingPage = 0;
        this.hoursPerPage = this.calculateHoursPerPage(
          this.pageSize,
          startingPage
        );
        this.hoursPerPage = (Math.round(this.hoursPerPage * 100) / 100).toFixed(
          2
        );
      }
    });
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
   * Loads the table and sets the datasource and pagination for it
   */
  workLogList() {
    this.totalHours = 0;
    this.searchWorkLogList = [];
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
          this.setDataSource(this.searchWorkLogList);
          const startingPage = 0;
          const sizePageOne = 10;
          this.hoursPerPage = this.calculateHoursPerPage(
            sizePageOne,
            startingPage
          );
          this.hoursPerPage = (
            Math.round(this.hoursPerPage * 100) / 100
          ).toFixed(2);
        }
      });
  }

  /**
   * Sets the datasource and paginator of the table
   */
  setDataSource(searchWorkLogList) {
    this.dataSource = new MatTableDataSource<SearchWorkLog>(searchWorkLogList);
    this.dataSource.paginator = this.paginator;
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
   * Calculates the hours of page based on the page size and in page index
   * @param pageSize
   * @param pageIndex
   */
  calculateHoursPerPage(pageSize, pageIndex) {
    let sumHours = 0;
    for (let index = 0; index < pageSize; index++) {
      if (
        index == this.searchWorkLogList.length ||
        index > this.searchWorkLogList.length
      ) {
        break;
      }
      if (pageIndex != 0) {
        if (pageIndex + index == this.searchWorkLogList.length) {
          break;
        }
        sumHours += this.searchWorkLogList[pageIndex + index].spentTime;
      } else {
        sumHours += this.searchWorkLogList[index].spentTime;
      }
    }
    return sumHours;
  }

  /**
   * Activated when the index page changed, its gets the page events and calls the calculateHoursPerPage function
   * @param event
   */
  getNext(event: PageEvent) {
    this.pageChanged = false;
    let pageSize = event.pageSize;
    let pageIndex = event.pageIndex;
    let previousIndex = event.previousPageIndex;
    if (pageIndex == 0) {
      const firstPage = 0;
      this.hoursPerPage = this.calculateHoursPerPage(pageSize, firstPage);
      this.hoursPerPage = (Math.round(this.hoursPerPage * 100) / 100).toFixed(
        2
      );
      this.pageSize = pageSize;
    }
    if (pageIndex != previousIndex) {
      this.pageChanged = true;
      this.hoursPerPage = this.calculateHoursPerPage(
        pageSize,
        pageSize * pageIndex
      );
      this.hoursPerPage = (Math.round(this.hoursPerPage * 100) / 100).toFixed(
        2
      );
      this.pageSize = pageSize;
    }
  }
}
