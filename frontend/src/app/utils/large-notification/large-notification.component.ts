import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-large-notification",
  templateUrl: "./large-notification.component.html",
  styleUrls: ["./large-notification.component.scss"],
})
export class LargeNotificationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LargeNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
