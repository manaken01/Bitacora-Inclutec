import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CommonConstants } from "../../../../common/common.constant";
import { UserService } from "../../../../services/user.service";
import { UserEditorComponent } from "./user-editor/user-editor.component";
import { LargeNotificationComponent } from "src/app/utils/large-notification/large-notification.component";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"],
  providers: [CommonConstants],
})
export class UsersListComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public displayedColumns: string[];
  public usersList: any;
  public dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private userService: UserService, public dialog: MatDialog) {
    this.displayedColumns = CommonConstants.usersListColumns;
    this.usersList = [];
  }

  ngOnInit() {
    this.getUsersData();
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
  setDataSource(userDataList) {
    this.dataSource = new MatTableDataSource<any>(userDataList);
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Gets the structure of the project
   */
  getUsersData() {
    this.userService
      .getAllUsersData()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.usersList = response;
        this.setDataSource(response);
      });
  }

  /**
   * Opens the editor modal
   * @param user
   */
  openEditionModal(user) {
    const dialogRef = this.dialog.open(UserEditorComponent, {
      width: "600px",
      data: {
        user: user,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.openNotificacition(
          "Se guardaron con exito los cambios del colaborador.",
          "Cambios Guardados",
          "success"
        );
      } else if (result === "error") {
        this.openNotificacition(
          "Ocurrio un error al modificar la información del colaborador, por favor vuelva a intentarlo o comuniquese con el administrador de Bitácora.",
          "Error",
          "warning"
        );
      }
    });
  }

  /**
   * opens the modal notificacion.
   * @param message
   * @param title
   * @param type
   */
  openNotificacition(message, title, type) {
    const dialogRef = this.dialog.open(LargeNotificationComponent, {
      width: "650px",
      data: {
        title: title,
        message: message,
        type: type,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
