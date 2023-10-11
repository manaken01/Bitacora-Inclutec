import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { LargeNotificationComponent } from "src/app/utils/large-notification/large-notification.component";
import { CommonConstants } from "src/app/common/common.constant";
import { UserService } from "src/app/services/user.service";
import { UserEditorComponent } from "../../../../users-list/user-editor/user-editor.component";

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  public dialog: MatDialog;
  displayedColumns: string[] = ['role','edition']; // Agrega otras columnas aquí si es necesario
  dataSource = new MatTableDataSource<any>([
    { role: 'Desarrollador(a)' },
    { role: 'Asistente(a)' },
    { role: 'Coordinador(a)' },
    { role: 'Diseñador(a)' },
    { role: 'Administrador(a)' },
    { role: 'Promotor(a)' },
    { role: 'Evaluador(a)' },
    { role: 'Investigador(a)' },
    
    // Agrega más datos aquí si es necesario
  ]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
  }

  openEditionModal() {
    const dialogRef = this.dialog.open(UserEditorComponent, {
      width: "600px",
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
