import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"]
})
export class NotificationsComponent implements OnInit {
  @Input() isShow: boolean;
  @Input() message: string;
  @Input() typeSuccess: boolean;
  @Output() notificationEvent: EventEmitter<boolean>;

  public staticAlertClosed = false;
  public successMessage: string;
  public condition = false;

  constructor() {
    this.notificationEvent = new EventEmitter<boolean>();
  }

  ngOnInit(): void {
    this.hideNotificationPopUp();
  }

  /**
   * Hides the notificaction modal after a period of time based on the setTimeout
   */
  hideNotificationPopUp() {
    setTimeout(() => {
      this.isShow = !this.isShow;
      this.notificationEvent.emit(this.isShow);
    }, 2000);
  }
}
