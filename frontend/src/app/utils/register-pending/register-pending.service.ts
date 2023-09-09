import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { PendingModel } from "../../models/pending.model";

@Injectable()
export class RegisterPendingService {
  private subject = new Subject<any>();
  public task = new PendingModel();

  /**
   * gets the value passed and the function
   * @param any
   * @param siFn
   */
  alertThis(any, siFn: () => void) {
    this.setAlert(any, siFn);
  }

  /**
   * gets the value and function passed from the alertThis functions and
   * set
   * @param any
   * @param siFn
   */
  setAlert(any, siFn: () => void) {
    let that = this;
    this.task = any;
    that.subject.next({
      siFn: function() {
        that.subject.next();
        siFn();
      }
    });
  }

  /**
   * Returns this task
   */
  getTaskSelected() {
    return this.task;
  }

  /**
   * Returns this subject
   */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
