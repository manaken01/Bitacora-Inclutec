import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EncryptService } from '../../../services/encrypt.service';
import { CommonConstants } from '../../../common/common.constant';
import { WorklogService } from '../../../services/worklog.service';
import { UserService } from '../../../services/user.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RequestProjectComponent } from './request-project/request-project.component';
import { LargeNotificationComponent } from '../../../utils/large-notification/large-notification.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [EncryptService, CommonConstants, WorklogService, UserService],
})
export class ProfileComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public profileForm: FormGroup;
  public displayedColumns: string[];
  public editable: boolean;
  public projectList: any;
  public roleList: any;
  public userData: any;
  public dataSource: any;
  public name: any;
  public lastname: any;
  public initialName: any;
  public initialLastname: any;
  public userRole: any;
  public isReady: boolean;
  public type: string;
  public message: any;
  public messageModal: string;
  public typeSuccess: boolean;
  public disabilitiesArray: any;
  public personalDisabilities: any;
  public disabilitiesActivited: boolean;

  /**
   * Profile component constructor
   * @param encryptService
   * @param worklogService
   * @param formBuilder
   * @param userService
   * @param dialog
   */
  constructor(
    private encryptService: EncryptService,
    private worklogService: WorklogService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialog: MatDialog,
  ) {
    this.userData = {};
    this.displayedColumns = CommonConstants.profileColummns;
    this.roleList = CommonConstants.usersRoles;
    this.projectList = [];
    this.editable = false;
    this.disabilitiesArray = [];
    this.personalDisabilities = [];
    this.disabilitiesActivited = false;
  }

  ngOnInit() {
    const idUser = this.encryptService.desencrypt('idUser');
    this.formConfiguration();
    this.projectsByUser(idUser);
    this.userInfo(idUser);
    this.ValidateAccessibility(idUser);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Looks up for any disability linked to this user
   */
  ValidateAccessibility(idUser) {
    const formValue = [];
    this.userService
      .validateUserDisabilities(idUser)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        if (response.length > 0) {
          this.personalDisabilities = response;
          response.forEach((element) => {
            formValue.push(element.idDisabilitiesFk);
          });
          this.loadDisabilities(formValue);
        }
      });
  }

  /**
   * Load into disabilities array all the disabilities
   */
  loadDisabilities(formValue) {
    this.userService
      .getDisabilities()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.disabilitiesArray = response;
        this.profileForm.addControl(
          'disabilities',
          new FormControl({ value: '', disabled: true }, [Validators.required]),
        );
        this.profileForm.controls.disabilities.setValue(formValue);
        this.disabilitiesActivited = true;
      });
  }

  /**
   * Creates the form configuration.
   */
  formConfiguration() {
    this.profileForm = this.formBuilder.group({
      name: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(90),
      ]),
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(60),
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,9}$/),
      ]),
      country: new FormControl({ value: '', disabled: true }, [
        Validators.maxLength(45),
      ]),
      postalCode: new FormControl({ value: '', disabled: true }, [
        Validators.maxLength(45),
      ]),
      role: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(200),
      ]),
    });
  }

  /**
   * Loads the users projects
   * @param idUser
   */
  projectsByUser(idUser) {
    this.worklogService
      .getProjectsByUsers(idUser)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((projects) => {
        this.projectList = projects;
        this.dataSource = new MatTableDataSource(this.projectList);
      });
  }

  /**
   * Loads the user data and set the form values with that data
   * @param idUser
   */
  userInfo(idUser) {
    this.userService
      .getInfoUser(idUser)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((userData) => {
        this.userData = userData;
        this.initialName = this.userData.name.charAt(0);
        this.initialLastname = this.userData.lastName.charAt(0);
        this.profileForm.setValue({
          name: this.userData.name + ' ' + this.userData.lastName,
          email: this.userData.email,
          country: this.userData.country,
          postalCode: this.userData.postalCode,
          role: this.userData.role,
        });
      });
  }

  /**
   * Enables the form so the user can edit his infor
   */
  enabledEdit() {
    this.profileForm.enable();
    this.editable = true;
  }

  /**
   * Edits the user data
   * @param credencials
   */
  editInfo(credencials: any) {
    const userName = credencials.name.split(' ');
    if (this.validateName(userName)) {
      this.userData.email = credencials.email;
      this.userData.country = credencials.country;
      this.userData.postalCode = credencials.postalCode;
      this.userData.role = credencials.role;
      if (this.disabilitiesActivited) {
        this.actionDisabilities(credencials.disabilities);
      }
      this.userService
        .putUserInfo(this.userData)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((response) => {
          this.editable = false;
          this.profileForm.disable();
        });
    }
  }

  /**
   * Validates which optios has to be done with the disabilites credencials,
   * whatever its delete a disability from the user or add a new one
   */
  actionDisabilities(credencials) {
    const newDisabilities = this.validateAddDisability(credencials);
    const deleteDisabilities = this.validateDeleteDisability(credencials);
    const idUser = this.encryptService.desencrypt('idUser');
    let disability;
    if (newDisabilities.length > 0) {
      newDisabilities.forEach((element) => {
        this.addDisability(idUser, element);
      });
    }
    if (deleteDisabilities.length > 0) {
      deleteDisabilities.forEach((element) => {
        disability = this.personalDisabilities.find(
          (obj) => obj.idDisabilitiesFk === element,
        );
        this.deleteDisability(disability.id);
      });
    }
  }

  /**
   * Adds a new disability to the users data
   * @param idUser
   * @param idDisability
   */
  addDisability(idUser, idDisability) {
    this.userService
      .postUsersDisability(idUser, idDisability)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => { });
  }

  /**
   * Returns the values of the array which are not on the personal disabilities array
   * @param collaborators
   */
  validateAddDisability(newDisabilities) {
    const personalDisabilities = [];
    this.personalDisabilities.forEach((element) => {
      personalDisabilities.push(element.idDisabilitiesFk);
    });
    return newDisabilities.filter(function (obj) {
      return personalDisabilities.indexOf(obj) == -1;
    });
  }

  /**
   * Deletes a disability from an users data
   */
  deleteDisability(idUserByDisability) {
    this.userService
      .deleteUserByDisability(idUserByDisability)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => { });
  }

  /**
   * Returns the values of the array which are not on the credencials disabilities array
   * @param collaborators
   */
  validateDeleteDisability(newDisabilities) {
    const personalDisabilities = [];
    this.personalDisabilities.forEach((element) => {
      personalDisabilities.push(element.idDisabilitiesFk);
    });
    return personalDisabilities.filter(function (obj) {
      return newDisabilities.indexOf(obj) == -1;
    });
  }

  /**
   * Validates the name of the user based on the length of an array
   * which its a split of spaces
   * @param userName
   */
  validateName(userName) {
    let lastName = '';
    let name = '';
    let validData = true;
    switch (userName.length) {
      case 1:
        lastName = "";
        if (this.validateNameLength(userName[0], lastName)) {
          this.userData.name = userName[0];
          this.userData.lastName = lastName;
        } else {
          validData = false;
        }
        break;
      case 2:
        lastName = userName[userName.length - 1];
        if (this.validateNameLength(userName[0], lastName)) {
          this.userData.name = userName[0];
          this.userData.lastName = lastName;
        } else {
          validData = false;
        }
        break;
      case 3:
        lastName =
          userName[userName.length - 2] + ' ' + userName[userName.length - 1];
        if (this.validateNameLength(userName[0], lastName)) {
          this.userData.name = userName[0];
          this.userData.lastName = lastName;
        } else {
          validData = false;
        }
        break;
      case 4:
        lastName =
          userName[userName.length - 2] + ' ' + userName[userName.length - 1];
        name = userName[0] + ' ' + userName[1];
        if (this.validateNameLength(name, lastName)) {
          this.userData.name = name;
          this.userData.lastName = lastName;
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
      this.openNotificacition(
        'El apellido sobrepasa los 45 caracteres.',
        'Apellido no válido.',
        'warning',
      );
      validData = false;
    } else if (name.length > 45) {
      this.openNotificacition(
        'El nombre sobrepasa los 45 caracteres.',
        'Nombre no válido.',
        'warning',
      );
      validData = false;
    }
    return validData;
  }

  /**
   * Opens the password modal
   */
  openPasswordModal() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '650px',
      data: {
        userId: this.userData.idUsersPk,
        email: this.userData.email,
        name: this.userData.name,
        lastName: this.userData.lastName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.openNotificacition(
          'Se guardo con éxito la nueva contraseña.',
          'Contraseña con éxito',
          'success',
        );
      }
    });
  }

  /**
   * Opens the request modal
   */
  openRequestModal() {
    const dialogRef = this.dialog.open(RequestProjectComponent, {
      width: '650px',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.openNotificacition(
          'Se envió con éxito la solicitud de colaboración.' +
          'Pronto será contactado por el administrador de Bitácora.',
          'Solicitud Enviada',
          'success',
        );
      }
    });
  }

  /**
   * Opens the large notification modal and sends the properties
   * @param message
   * @param title
   * @param type
   */
  openNotificacition(message, title, type) {
    const dialogRef = this.dialog.open(LargeNotificationComponent, {
      width: '650px',
      data: {
        title: title,
        message: message,
        type: type,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
}
