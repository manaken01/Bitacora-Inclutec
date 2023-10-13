import { Component, OnInit } from "@angular/core";
import { WorklogService } from "./../../../services/worklog.service";
import { PendingModel } from "./../../../models/pending.model";
import { EncryptService } from "../../../services/encrypt.service";
import { RegisterPendingService } from "../../../utils/register-pending/register-pending.service";
import { MatDialog } from "@angular/material/dialog";
import { RegisterPendingComponent } from "../../../utils/register-pending/register-pending.component";

@Component({
  selector: "app-pending",
  templateUrl: "./pending.component.html",
  styleUrls: ["./pending.component.scss"],
  providers: [WorklogService, EncryptService, RegisterPendingService],
})
export class PendingComponent implements OnInit {
  public list: PendingModel[];
  public loading: boolean;
  public loadingCount: number;
  /**
   * Pending component constructor
   * @param worklogService
   * @param encryptService
   * @param dialog
   */
  constructor(
    private worklogService: WorklogService,
    private encryptService: EncryptService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    const idUser = this.encryptService.desencrypt("idUser");
    this.loading = true;
    let projectsList: PendingModel[];
    let xList: PendingModel[];
    
    this.worklogService.getWorklogPendings(idUser).subscribe((x) => {
      this.worklogService.getProjectsByUsers(idUser).subscribe(
        (data) => {
          // La variable 'data' contiene los datos que devuelve el servicio
          projectsList = data; // Guarda los datos en la lista
          xList = x
          for (let j = 0; j < xList.length; j++) {
            for (let i = 0; i < projectsList.length; i++) {
              console.log(xList[j].idProjectsFk)
              if (xList[j].idProjectsFk == projectsList[i].idProjectsPk) {
                xList[j].projectName = projectsList[i].projectName
              }
            }
          }
          this.list = x;
          this.loading = false;
      });
      
    });
  }

  /**
   * Opens the register pending modal
   * @param pendingTask
   */
  registerModal(pendingTask: any) {
    const dialogRef = this.dialog.open(RegisterPendingComponent, {
      width: "550px",
      data: {
        event: pendingTask,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.ngOnInit();
      }
    });
  }
}
