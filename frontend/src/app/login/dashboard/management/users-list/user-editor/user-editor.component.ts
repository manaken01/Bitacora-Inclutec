import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil, last } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { UserService } from '../../../../../services/user.service';
import { WorklogService } from '../../../../../services/worklog.service';
import { CommonConstants } from '../../../../../common/common.constant';
import { ConfirmChangeComponent } from '../confirm-change/confirm-change.component';
import { LargeNotificationComponent } from 'src/app/utils/large-notification/large-notification.component';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
  providers: [CommonConstants],
})
export class UserEditorComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public editorForm: FormGroup;
  public username: string;
  public projectList: any;
  public userProjectsList: any;
  public roleList: any;
  public usersTypes: any;
  public userData: any;

  constructor(
    private worklogService: WorklogService,
    public dialogRef: MatDialogRef<UserEditorComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.username = this.data.user.name + ' ' + this.data.user.lastName;
    this.roleList = CommonConstants.usersRoles;
    this.usersTypes = CommonConstants.userTypes;
    this.projectList = [];
    this.userProjectsList = [];
    this.userData = this.data.user;
  }

  ngOnInit() {
    this.formConfiguration();
    this.allProjects();
  }

  onNoClick(message: string): void {
    this.dialogRef.close(message);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Creates the form configuration.
   */
  formConfiguration() {
    this.editorForm = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(90),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(60),
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,9}$/),
      ]),
      typeUser: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      projects: new FormControl(''),
      status: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Gets the projects the users its collaborating
   */
  userProjects() {
    this.userProjectsList = [];
    this.worklogService
      .getAllUserProjects(this.userData.idUsersPk)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((projects) => {
        projects.forEach((element) => {
          this.userProjectsList.push(element.idProjectsPk);
        });
        this.editorForm.setValue({
          username: this.username,
          email: this.userData.email,
          typeUser: this.userData.typeUser,
          role: this.userData.role,
          projects: this.userProjectsList,
          status: this.userData.isActive,
        });
      });
  }

  /**
   * Gets all the projects
   */
  allProjects() {
    this.worklogService
      .getAllProjects()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((projects) => {
        this.projectList = projects;
        this.userProjects();
      });
  }

  /**
   * Updates the user data
   * @param credencials
   */
  updateUser(credencials) {
    const userName = credencials.username.split(' ');
    if (this.validateName(userName)) {
      this.userData.email = credencials.email;
      this.userData.typeUser = credencials.typeUser;
      this.userData.role = credencials.role;
      this.actionProjects(credencials.projects);
      this.validateStatus(credencials.status, this.userData.isActive);
    }
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
   * Validates which optios has to be done with the projects credencials,
   * whatever its delete a project from the user or add a new one
   */
  actionProjects(credencials) {
    const newProjects = this.validateNewProject(credencials);
    const deleteProjects = this.validateDeleteProject(credencials);
    const idUser = this.userData.idUsersPk;
    let body;
    if (newProjects.length > 0) {
      newProjects.forEach((element) => {
        body = {
          idProjectsFk: element,
          idUsersFk: idUser,
        };
        this.addUserByProject(body);
      });
    }
    if (deleteProjects.length > 0) {
      deleteProjects.forEach((element) => {
        this.deleteUserByProject({ idUser: idUser, idProject: element });
      });
    }
  }

  /**
   * Returns the values of the array which are not on the personal projects array
   * @param collaborators
   */
  validateNewProject(newProjects) {
    const projects = [];
    this.userProjectsList.forEach((element) => {
      projects.push(element);
    });
    return newProjects.filter(function (obj) {
      return projects.indexOf(obj) == -1;
    });
  }

  /**
   * Bind new collaborators to the project selected
   * @param collaborators
   */
  addUserByProject(body) {
    this.worklogService
      .postUserByProject(body)
      .pipe(takeUntil(this.onDestroy))
      .subscribe();
  }

  /**
   * Deletes the binding between an user and a project
   * @param body
   */
  deleteUserByProject(body) {
    this.worklogService
      .deleteUserByProject(body)
      .pipe(takeUntil(this.onDestroy))
      .subscribe();
  }

  /**
   * Returns the values of the array which are not on the credencials projects array
   * @param collaborators
   */
  validateDeleteProject(newProjects) {
    const projects = [];
    this.userProjectsList.forEach((element) => {
      projects.push(element);
    });
    return projects.filter(function (obj) {
      return newProjects.indexOf(obj) == -1;
    });
  }

  /**
   * Validates if the new status of the user its been change to an inactive status
   * @param newStatus
   * @param oldStatus
   */
  validateStatus(newStatus, oldStatus) {
    if (newStatus === 0 && newStatus !== oldStatus) {
      this.userService
        .putUserInfo(this.userData)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((response) => {
          this.openConfirmChange(newStatus, oldStatus);
        });
    } else {
      this.userData.isActive = newStatus;
      this.userService
        .putUserInfo(this.userData)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((response) => {
          this.onNoClick('success');
        });
    }
  }

  /**
   * Opens the confirm modal for the new status of the user
   */
  openConfirmChange(newStatus, oldStatus) {
    const dialogRef = this.dialog.open(ConfirmChangeComponent, {
      width: '650px',
      data: {
        user: this.userData,
        newStatus: newStatus,
        oldStatus: oldStatus,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.onNoClick('success');
    });
  }

  /**
   * opens the modal notificacion.
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
