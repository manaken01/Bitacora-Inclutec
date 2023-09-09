import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-alerts",
  templateUrl: "./alerts.component.html",
  styleUrls: ["./alerts.component.scss"]
})
export class AlertsComponent implements OnInit {
  @Input() isShow: boolean;
  @Input() message: string;
  @Input() typeSuccess: boolean;
  @Output() notificationEvent: EventEmitter<boolean>;

  staticAlertClosed = false;
  successMessage: string;
  condition = false;

  constructor() {
    this.notificationEvent = new EventEmitter<boolean>();
  }

  ngOnInit(): void {
    this.hideNotificationPopUp();
  }

  hideNotificationPopUp() {
    setTimeout(() => {
      this.isShow = !this.isShow;
      this.notificationEvent.emit(this.isShow);
    }, 5000);
  }
}
