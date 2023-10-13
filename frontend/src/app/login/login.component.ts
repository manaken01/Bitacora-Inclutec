import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {UserLoginModel} from './../models/userLogin.model';
import {LoginService} from './../services/login.service';
import {UserService} from './../services/user.service';
import {EncryptService} from '../services/encrypt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService, UserService, EncryptService],
})
export class LoginComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public loginForm: FormGroup;
  public user: UserLoginModel;
  public list = [];
  public base = 10;
  public isReady: boolean;
  public type: string;
  public message: string;
  public typeSuccess: boolean;
  public messageRegister: string;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private userService: UserService,
    private encryptService: EncryptService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.buildForm();
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.registered !== undefined && params.registered === 'true') {
        const message =
          '¡Se registró con éxito su usuario! Por favor verifique su correo para continuar.';
        this.showSuccess(message);
      } else if (params.uid !== undefined && params.token !== undefined) {
        this.userService
          .getConfirmUser(params.uid, params.token)
          .pipe(takeUntil(this.onDestroy))
          .subscribe(
            (response) => {
              const message =
                '¡Se verificó con éxito su correo! Ingrese los datos solicitados y comience sus registros.';
              this.showSuccess(message);
            },
            (error) => {},
          );
      }else if (params.pass !== undefined && params.pass === 'true') {
        const message =
          'Se envió una contraseña temporal a su correo electrónico.';
        this.showSuccess(message);
      } 
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Creates the form configuration.
   */
  buildForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  /**
   * Calls the loopback login service
   */
  getLogin() {
    this.user = <UserLoginModel>this.loginForm.value;
    this.loginService.login(this.user).subscribe(
      (data) => this.handleLogin(data),
      (error) => this.showError('Error: Datos incorrectos.'),
    );
  }

  /**
   * Error notification
   * @param err
   */
  showError(err) {
    this.isReady = true;
    this.typeSuccess = false;
    this.message = err;
  }

  /**
   * Success notificaction
   * @param message
   */
  showSuccess(message) {
    this.isReady = true;
    this.typeSuccess = true;
    this.message = message;
  }

  /**
   * Boolean that show the notification
   * @param hide
   */
  handleNotificationEventEmitted(hide: any) {
    this.isReady = hide;
  }

  /**
   * Handles the login
   * @param user
   */
  handleLogin(user: any) {
    this.encryptService.encrypt('idUser', user.userId);
    this.encryptService.encrypt('accessToken', user.id);
    this.getUserInfo('idUser');
  }

  /**
   * Gets the data of the user
   * @param name
   */
  getUserInfo(name: any) {
    this.userService
      .getInfoUser(parseInt(this.encryptService.desencrypt(name), this.base))
      .subscribe(
        (data) => this.handleUSerInfo(data),
        (error) => error,
      );
  }

  /**
   * Saves important data from the user into the local storage and also validates if the user is active or not
   * @param userInfo
   */
  handleUSerInfo(userInfo: any) {
    const accessToken = this.encryptService.desencrypt('accessToken');
    if (userInfo.isActive !== 1) {
      this.loginService.logout(accessToken).subscribe((response) => {
        this.showError(
          'Error: Usuario inactivado, contacte a un administrador de Bitácora.',
        );
      });
    } else {
      this.encryptService.encrypt('userCost', userInfo.costPerHour);
      this.encryptService.encrypt('idUnitFk', userInfo.idUnitFk);
      this.encryptService.encrypt('name', userInfo.name);
      this.encryptService.encrypt('lastname', userInfo.lastName);
      this.encryptService.encrypt('role', userInfo.typeUser);
      localStorage.setItem('loggedIn', 'true');
      return this.router.navigate(['dashboard/register']);
    }
  }
}
