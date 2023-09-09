import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class NewTaskService {
  private subject = new Subject<any>();

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
    that.subject.next({
      siFn: function() {
        that.subject.next();
        siFn();
      }
    });
  }

  /**
   * Returns this subject
   */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
