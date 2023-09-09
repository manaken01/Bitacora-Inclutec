import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { registerUser } from '../../models/registerUser.model';
import { CommonConstants } from '../../common/common.constant';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  providers: [UserService, CommonConstants, DatePipe],
})
export class RegisterUserComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  protected onDestroy = new Subject<void>();
  public isReady: boolean;
  public type: string;
  public message: string;
  public typeSuccess: boolean;
  public accessibility: boolean;
  public disabilitiesArray: any;
  public roleList: any;
  public maxDate: any;

  /**
   * Register user constructor
   * @param formBuilder
   * @param userService
   * @param location
   * @param router
   * @param datePipe
   */
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private location: Location,
    private router: Router,
    private datePipe: DatePipe,
  ) {
    this.accessibility = false;
    this.roleList = CommonConstants.usersRoles;
    this.maxDate = new Date();
    this.maxDate = this.datePipe.transform(this.maxDate, 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.formConfiguration();
    this.loadDisabilities();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Form settings
   */
  formConfiguration() {
    this.registerForm = this.formBuilder.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.maxLength(60),
            Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,9}$/),
          ],
        ],
        name: ['', [Validators.required, Validators.maxLength(90)]],
        bornDate: ['', [Validators.required]],
        role: ['', [Validators.required, Validators.maxLength(40)]],
        password: ['', [Validators.required, Validators.maxLength(20)]],
        repeatPassword: ['', [Validators.required, Validators.maxLength(20)]],
        country: ['', [Validators.maxLength(40)]],
        postalCode: ['', [Validators.maxLength(40)]],
      },
      {
        validator: this.userService.checkIfMatchingPasswords(
          'password',
          'repeatPassword',
        ),
      },
    );
  }

  /**
   * Returns to the previous link
   */
  backClicked() {
    this.location.back();
  }

  /**
   * Creates the disabilities form control if the option of accessibility is activated
   */
  activeDisabilities() {
    if (this.accessibility) {
      this.accessibility = false;
      this.registerForm.removeControl('disabilities');
    } else {
      this.accessibility = true;
      this.registerForm.addControl(
        'disabilities',
        new FormControl('', [Validators.required]),
      );
    }
  }

  /**
   * Load into disabilities array all the disabilities
   */
  loadDisabilities() {
    this.userService
      .getDisabilities()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.disabilitiesArray = response;
      });
  }

  /**
   * Post users data and redirects to login
   * @param credencials
   */
  registerUser(credencials: any) {
    const arrayLastname = credencials.name.split(' ');
    const user = credencials as registerUser;
    const currentDate = new Date();
    this.validateName(arrayLastname, user);
    user.idUsersPk = 0;
    user.username = credencials.email;
    user.createdAt = currentDate;
    this.userService
      .postRegisterUser(user)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response) => {
          if (this.accessibility) {
            credencials.disabilities.forEach((element) => {
              this.postUsersDisability(response.idUsersPk, element);
            });
            this.router.navigate(['login'], {
              queryParams: { registered: 'true' },
            });
          } else {
            this.router.navigate(['login'], {
              queryParams: { registered: 'true' },
            });
          }
        },
        (error) => {
          if (error.error.error.statusCode == 422) {
            const message = 'Error: Correo ya en uso';
            this.showError(message);
          }
        },
      );
  }

  /**
   *
   * @param userName
   * @param user
   */
  postUsersDisability(idUser, idDisability) {
    this.userService
      .postUsersDisability(idUser, idDisability)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => { });
  }

  /**
   * Validates the name of the user based on the length of an array
   * which its a split of spaces
   * @param userName
   */
  validateName(userName, user) {
    let lastName = '';
    let name = '';
    let validData = true;
    switch (userName.length) {
      case 1:
        lastName = "";
        if (this.validateNameLength(userName[0], lastName)) {
          user.name = userName[0];
          user.lastName = lastName;
        } else {
          validData = false;
        }
        break;
      case 2:
        lastName = userName[userName.length - 1];
        if (this.validateNameLength(userName[0], lastName)) {
          user.name = userName[0];
          user.lastName = lastName;
        } else {
          validData = false;
        }
        break;
      case 3:
        lastName =
          userName[userName.length - 2] + ' ' + userName[userName.length - 1];
        if (this.validateNameLength(userName[0], lastName)) {
          user.name = userName[0];
          user.lastName = lastName;
        } else {
          validData = false;
        }
        break;
      case 4:
        lastName =
          userName[userName.length - 2] + ' ' + userName[userName.length - 1];
        name = userName[0] + ' ' + userName[1];
        if (this.validateNameLength(name, lastName)) {
          user.name = name;
          user.lastName = lastName;
        } else {
          validData = false;
        }
        break;
      default:
        break;
    }
    return validData;
  }

  /**
   * Validates the length of the name and lastname before making them oficial
   * @param name
   * @param lastname
   */
  validateNameLength(name, lastname) {
    let validData = true;
    if (lastname.length > 45) {
      this.showError('El apellido sobrepasa los 45 caracteres.');
      validData = false;
    } else if (name.length > 45) {
      this.showError('El nombre sobrepasa los 45 caracteres.');
      validData = false;
    }
    return validData;
  }

  /**
   * show alert modal error
   * @param message
   */
  showError(message) {
    this.isReady = true;
    this.typeSuccess = false;
    this.message = message;
  }

  /**
   * Hides alert modal after the timeOut goes
   * @param hide
   */
  handleNotificationEventEmitted(hide: any) {
    this.isReady = hide;
  }
}
