import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { CommonConstants } from '../../common/common.constant';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.scss'],
  providers: [UserService, CommonConstants],
})
export class ForgottenPasswordComponent implements OnInit, OnDestroy {
  public forgottenPasswordForm: FormGroup;
  protected onDestroy = new Subject<void>();
  public isReady: boolean;
  public type: string;
  public message: string;
  public typeSuccess: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.formConfiguration();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  formConfiguration() {
    this.forgottenPasswordForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,9}$/
          ),
        ],
      ],
    });
  }

  backClicked() {
    this.location.back();
  }

  requestForgottenPassword() {
    // this.userService
    //   .requestForgottenPassword(this.forgottenPasswordForm.value.email)
    //   .pipe(takeUntil(this.onDestroy))
    //   .subscribe(
    //     (response) => {
    //       this.router.navigate(['login'], {
    //         queryParams: { passwordResetRequested: 'true' },
    //       });
    //     },
    //     (error) => {
    //       this.showError('Error: No se pudo solicitar la contraseña olvidada.');
    //     }
    //   );
  }

  showError(message) {
    this.isReady = true;
    this.typeSuccess = false;
    this.message = message;
  }

  handleNotificationEventEmitted(hide: any) {
    this.isReady = hide;
  }
}
