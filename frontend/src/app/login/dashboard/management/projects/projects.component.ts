import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";

import { WorklogService } from "../../../../services/worklog.service";
import { ProjectsService } from "../../../../services/projects.service";
import { EncryptService } from "../../../../services/encrypt.service";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { LargeNotificationComponent } from "../../../../utils/large-notification/large-notification.component";
import { ModalCollaboratorsComponent } from "./modal-collaborators/modal-collaborators.component";
import { ConfirmEditsComponent } from "./confirm-edits/confirm-edits.component";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public phaseForm: FormGroup;
  public activityForm: FormGroup;
  public taskForm: FormGroup;
  public mode: any;

  public projectList: any;
  public phaseList: any;
  public activityList: any;
  public taskList: any;
  public projectData: any;

  public projectName: string;
  public idProject: any;
  public phaseName: string;
  public phasesNames: any;
  public activityName: string;
  public activitiesNames: any;
  public taskName: string;
  public tasksNames: any;

  public projectButton: boolean;
  public phaseButton: boolean;
  public activityButton: boolean;
  public taskButton: boolean;
  public projectEditor: boolean;
  public processing: boolean;

  public manageSteps: number;
  public phasesInputs: any;
  public editedElements: any;

  /**
   * Constructor management
   * @param ProjectService
   * @param encryptService
   * @param formBuilder
   * @param router
   * @param route
   */
  constructor(
    private worklogService: WorklogService,
    private projectService: ProjectsService,
    private encryptService: EncryptService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.phaseList = [];
    this.activityList = [];
    this.taskList = [];
    this.projectButton = false;
    this.phaseButton = false;
    this.activityButton = false;
    this.taskButton = false;
    this.projectEditor = false;
    this.processing = false;
    this.manageSteps = 0;
    this.projectName = "";
    this.idProject = 0;
    this.phaseName = "";
    this.activityName = "";
    this.taskName = "";
    this.mode = "NUEVO";
    this.phasesInputs = new FormArray([]);
    this.phasesNames = [];
    this.activitiesNames = [];
    this.tasksNames = [];
    this.editedElements = [];
  }

  ngOnInit() {
    this.handleRoleNav();
    this.taskFormConfig();
    this.projectsList();
    this.phaseFormConfig();
    this.activityFormConfig();
    this.validateParameters();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Returns to the all project table view
   */
  allProjectsView() {
    return this.router.navigate(["dashboard/management"]);
  }

  /**
   * If the users role its not administrator the user is redirected to the main page
   */
  handleRoleNav() {
    const userRole = this.encryptService.desencrypt("role");
    if (userRole != "Administrador") {
      this.router.navigate(["dashboard/register"], {});
    }
  }

  /**
   * Validates if the url has any parameters, if it has this means the view was open as a editor
   */
  validateParameters() {
    this.route.queryParams.subscribe((params) => {
      if (params.project !== undefined && params.name !== undefined) {
        this.mode = this.encryptService.desencryptVariable(params.name);
        this.idProject = this.encryptService.desencryptVariable(params.project);
        this.projectName = this.mode;
        this.projectEditor = true;
        this.projectSelected();
        this.nextStep(1);
        this.phasesList(this.idProject);
      }
    });
  }

  /**
   * Phase feature section form config
   */
  phaseFormConfig() {
    this.phaseForm = this.formBuilder.group({
      projectName: new FormControl("", [Validators.required]),
      phaseName: new FormControl("", [
        Validators.required,
        Validators.maxLength(70),
      ]),
      phases: new FormArray([]),
    });
  }

  /**
   * Activities feature section form config
   */
  activityFormConfig() {
    this.activityForm = this.formBuilder.group({
      activities: new FormArray([]),
    });
    this.addActivity();
  }

  /**
   * task feature section form config
   */
  taskFormConfig() {
    this.taskForm = this.formBuilder.group({
      tasks: new FormArray([]),
    });
    this.addTasks();
  }

  /**
   * Getter of phases array which its declare on the form config
   */
  get phases() {
    return this.phaseForm.get("phases") as FormArray;
  }

  /**
   * Getter of activities array which its declare on the form config
   */
  get activities(): FormArray {
    return this.activityForm.get("activities") as FormArray;
  }

  /**
   * Getter of tasks array which its declare on the form config
   */
  get tasks(): FormArray {
    return this.taskForm.get("tasks") as FormArray;
  }

  /**
   * Push a new control to the formArray phases
   */
  addPhaseInput() {
    this.phases.push(
      new FormControl("", [Validators.required, Validators.maxLength(70)])
    );
  }

  /**
   * Push a new control to the formArray activities
   */
  addActivity() {
    this.activities.push(
      new FormGroup({
        activity: new FormControl("", [
          Validators.maxLength(100),
          Validators.required,
        ]),
        phase: new FormControl(""),
        inputActivites: new FormArray([]),
      })
    );
  }

  /**
   * Push a new control to the formArray tasks
   */
  addTasks() {
    this.tasks.push(
      new FormGroup({
        task: new FormControl("", [
          Validators.maxLength(100),
          Validators.required,
        ]),
        activity: new FormControl(""),
        inputTasks: new FormArray([]),
      })
    );
  }

  /**
   * Push a new control to the formArray inputActivites
   */
  addInputActivites(index) {
    const control = (<FormArray>this.activityForm.controls["activities"])
      .at(index)
      .get("inputActivites") as FormArray;
    control.push(
      new FormControl("", [Validators.required, Validators.maxLength(100)])
    );
  }

  /**
   * Push a new control to the formArray inputTasks
   */
  addInputTasks(index) {
    const control = (<FormArray>this.taskForm.controls["tasks"])
      .at(index)
      .get("inputTasks") as FormArray;
    control.push(
      new FormControl("", [Validators.required, Validators.maxLength(100)])
    );
  }

  /**
   * Delete a form control of the formArray based on the index given
   * @param index
   */
  deletePhaseInput(index) {
    this.phases.removeAt(index);
    this.deleteActivity(index);
  }

  /**
   * Delete a form control of the formArray based on the index given
   * @param index
   */
  deleteActivity(index) {
    this.activities.removeAt(index);
  }

  /**
   * Delete a form control of the formArray based on the index given
   * @param index
   */
  deleteTask(index) {
    if (index != 0) {
      this.tasks.removeAt(index);
    }
  }

  /**
   * Delete a form control of the formArray based on the index given
   * @param index
   */
  deleteActivityInput(indexForm, indexDelete) {
    let control = (<FormArray>this.activityForm.controls["activities"])
      .at(indexForm)
      .get("inputActivites") as FormArray;
    control.removeAt(indexDelete);
    this.deleteTask(indexDelete);
  }

  /**
   * Delete a form control of the formArray based on the index given
   * @param index
   */
  deleteTasksInput(indexForm, indexDelete) {
    let control = (<FormArray>this.taskForm.controls["tasks"])
      .at(indexForm)
      .get("inputTasks") as FormArray;
    control.removeAt(indexDelete);
  }

  /**
   * Toggles the space to create a project
   */
  projectSelected() {
    if (this.projectButton) {
      this.projectButton = false;
      this.projectName = "";
      this.manageSteps = 0;
    } else {
      this.manageSteps = 0;
      this.projectButton = true;
      this.phaseButton = false;
      this.activityButton = false;
      this.taskButton = false;
    }
  }

  /**
   * Toggles the space to create a phase
   */
  phaseSelected() {
    if (this.phaseButton) {
      this.phaseButton = false;
      this.manageSteps = 0;
      this.phasesNames = [];
    } else {
      this.manageSteps = 0;
      this.phaseButton = true;
      this.projectButton = false;
      this.activityButton = false;
      this.taskButton = false;
    }
  }

  /**
   * Toggles the space to create a activity
   */
  activitySelected() {
    if (this.activityButton) {
      this.activityButton = false;
      this.manageSteps = 1;
      this.activitiesNames = [];
      this.phaseForm.enable();
    } else {
      this.manageSteps = 0;
      this.activityButton = true;
      this.projectButton = false;
      this.phaseButton = false;
      this.taskButton = false;
    }
  }

  /**
   * Fully empty a form array
   */
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  /**
   * Toggles the space to create a task
   */
  taskSelected() {
    if (this.taskButton) {
      this.taskButton = false;
      this.manageSteps = 2;
      this.tasksNames = [];
      this.activityForm.enable();
    } else {
      this.manageSteps = 0;
      this.taskButton = true;
      this.projectButton = false;
      this.phaseButton = false;
      this.activityButton = false;
    }
  }

  /**
   * Toggles the space of the next step and at final steps it formalizes all data
   */
  nextStep(step: number) {
    switch (step) {
      case 1:
        this.manageSteps = step;
        this.phaseButton = true;
        if (this.projectName !== "") {
          this.phaseForm.controls.projectName.setValue(this.projectName);
        }
        break;
      case 2:
        this.manageSteps = step;
        this.activityButton = true;
        break;
      case 3:
        this.manageSteps = step;
        this.taskButton = true;
        break;
      case 4:
        this.manageSteps = step;
        break;
      default:
        this.projectButton = true;
        break;
    }
  }

  /**
   * Gets the form values and pass them to local variables
   * such as an array of phases which stores the names of the phases added
   * and a phaseName which has the first phase name and the only one if they dont add more
   */
  newPhase(credentials: any) {
    this.phasesNames = [];
    this.phaseName = credentials.phaseName;
    this.clearFormArray(this.activities);
    this.addActivity();
    this.phasesNames.push({ phaseName: credentials.phaseName });
    if (credentials.phases.length > 0) {
      credentials.phases.forEach((element) => {
        this.phasesNames.push({
          phaseName: element,
        });
        this.addActivity();
      });
    }
    if (this.projectName == "") {
      this.projectName = credentials.projectName;
    }
    this.phaseForm.disable();
  }

  /**
   * Gets the form values and pass them to local variables
   * such as an array of phases which stores the names of the phases added
   * and a phaseName which has the first phase name and the only one if they dont add more
   */
  newActivity(credentials: any) {
    let phase = "";
    let activityData;
    let indexOfPhases = 0;
    this.activitiesNames = [];
    this.clearFormArray(this.tasks);
    credentials.activities.forEach((activity) => {
      if (this.phasesNames.length > 0) {
        phase = this.phasesNames[indexOfPhases].phaseName;
      } else {
        phase = activity.phase;
      }
      activityData = {
        phase: phase,
        activity: activity.activity,
        idPhase: this.phasesNames[indexOfPhases].idPhase,
      };
      this.activitiesNames.push(activityData);
      activity.inputActivites.forEach((newActivity) => {
        if (this.phasesNames.length > 0) {
          phase = this.phasesNames[indexOfPhases].phaseName;
        } else {
          phase = activity.phase;
        }
        activityData = {
          phase: phase,
          activity: newActivity,
          idPhase: this.phasesNames[indexOfPhases].idPhase,
        };
        this.activitiesNames.push(activityData);
        this.addTasks();
      });
      indexOfPhases++;
      this.addTasks();
      if (this.phasesNames.length == 0) {
        this.phasesNames.push(phase);
      }
    });
    this.activityForm.disable();
  }

  /**
   * Gets the credencials of the new tasks, bind them to the activity the are link to and
   * also binds the activity to the corresponding phase.
   * @param credentials
   */
  newTask(credentials: any) {
    this.tasksNames = [];
    let activity = "";
    let indexOfTasks = 0;
    let taskData;
    const nextStep = 4;
    credentials.tasks.forEach((task) => {
      this.activitiesNames[indexOfTasks];
      if (this.activitiesNames.length > 0) {
        taskData = {
          phase: this.activitiesNames[indexOfTasks].phase,
          task: task.task,
          activity: this.activitiesNames[indexOfTasks].activity,
          activityId: this.activitiesNames[indexOfTasks].idActivity,
        };
        this.tasksNames.push(taskData);
      } else {
        activity = task.activity;
        taskData = {
          task: task.task,
          activity: activity,
        };
        this.tasksNames.push(taskData);
      }
      task.inputTasks.forEach((newInput) => {
        if (this.activitiesNames.length > 0) {
          taskData = {
            phase: this.activitiesNames[indexOfTasks].phase,
            task: newInput,
            activity: this.activitiesNames[indexOfTasks].activity,
            activityId: this.activitiesNames[indexOfTasks].idActivity,
          };
          this.tasksNames.push(taskData);
        } else {
          activity = task.activity;
          taskData = {
            task: newInput,
            activity: activity,
          };
          this.tasksNames.push(taskData);
        }
      });
      indexOfTasks++;
    });
    this.nextStep(nextStep);
    this.taskForm.disable();
  }

  /**
   * Gets all the projects if the users chooses to create a phase and
   * not a project. The new phase has to be linked to an existing project.
   */
  projectsList() {
    this.projectService
      .getAllProjects()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.projectList = response;
      });
  }

  /**
   * Gets all the phases of a project
   */
  phasesList(idProject) {
    this.clearFormArray(this.phases);
    this.phaseList = [];
    const promise = new Promise((resolve) => {
      this.worklogService
        .getPhaseByProjects(idProject)
        .toPromise()
        .then(
          (data) => {
            this.phaseForm.removeControl("phaseName");
            this.phaseList = data;
            data.forEach((element, index) => {
              this.addPhaseInput();
              this.phases.controls[index].setValue(element.phaseName);
            });
            resolve(data);
          },
          (error) => {
            resolve(error);
          }
        );
    });
    return promise;
  }

  /**
   * Clears the activities form array for each new phase. set the first phase as the one being  pass,
   * this event its only trigger when selecting a unique phase. thats why most of the work with the arrays
   * start a the index 0, since there will be only one phase, and activities of that only phase.
   */
  phaseEditSelected(phase) {
    if (phase !== undefined) {
      this.clearFormArray(this.activities);
      this.phaseName = phase.phaseName;
      this.phasesNames[0] = {
        phaseName: this.phaseName,
        idPhase: phase.idPhasesPk,
      };
      this.worklogService
        .getActivitiesByPhase(phase.idPhasesPk)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((activity) => {
          this.activityList = activity;
          this.nextStep(2);
          this.addActivity();
          this.activities.controls[0].setValue({
            activity: "Editable",
            phase: this.phaseName,
            inputActivites: [],
          });
          const controlInputs = (<FormArray>(
            this.activityForm.controls["activities"]
          ))
            .at(0)
            .get("inputActivites") as FormArray;
          activity.forEach((element, index) => {
            this.addInputActivites(0);
            controlInputs.controls[index].setValue(element.activityName);
          });
        });
    } else {
      this.openNotificacition(
        "Este elemento no se encuentra registrado.",
        "Aviso",
        "warning"
      );
    }
  }

  /**
   * Clear the form array of tasks and adds one, this one has the data from previous steps seleted and also
   * for each tasks found related to the activity a input its created and a value its given to it
   * also setting the default input from just one activity with a default value 'this input value will not be use'
   */
  activityEditSelected(idActivity) {
    if (idActivity !== undefined) {
      this.taskList = [];
      this.clearFormArray(this.tasks);
      this.activitiesNames[0] = {
        activity: idActivity.activityName,
        idActivity: idActivity.idActivityPk,
        phase: this.phaseName,
      };
      this.worklogService
        .getTasksByActivities(idActivity.idActivityPk)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((task) => {
          this.taskList = task;
          this.nextStep(3);
          this.addTasks();
          this.tasks.controls[0].setValue({
            task: "Editable",
            activity: idActivity.activityName,
            inputTasks: [],
          });
          const controlInputs = (<FormArray>this.taskForm.controls["tasks"])
            .at(0)
            .get("inputTasks") as FormArray;
          task.forEach((element, index) => {
            this.addInputTasks(0);
            controlInputs.controls[index].setValue(element.taskName);
          });
        });
    } else {
      this.openNotificacition(
        "Este elemento no se encuentra registrado.",
        "Aviso",
        "warning"
      );
    }
  }

  /**
   * Gets the data of the project if it is selected instead of created
   */
  onChangeProjects(project: any) {
    this.projectName = project.projectName;
  }

  /**
   * Gets the data of the phase if it is selected instead of created
   */
  onChangePhase(phase: any) {
    this.phaseName = phase.phaseName;
  }

  /**
   * Creates a post to PhasesByProjects binding them
   * @param project
   * @param phase
   */
  bindPhaseAndProject(project: any, phase: any) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postPhaseByProject(phase, project)
        .toPromise()
        .then(
          (data) => {
            resolve(data);
          },
          (error) => {
            resolve(error);
          }
        );
    });
    return promise;
  }

  /**
   * Post a random color for a new project
   * @param idProjectsPk
   */
  postNewProjectColor(idProjectsPk) {
    const primaryColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    this.projectService
      .postColorProject(idProjectsPk, primaryColor, primaryColor)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {});
  }

  /**
   * Create a post to ActivitiesByPhases binding them
   * @param phase
   * @param activity
   */
  bindPhaseAndActivity(phase: any, activity: any) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postActivityByPhases(activity, phase)
        .toPromise()
        .then(
          (data) => {
            resolve(data);
          },
          (error) => {
            resolve(error);
          }
        );
    });
    return promise;
  }

  /**
   * Creates a post to TaskByActivty binding them
   * @param task
   * @param activity
   */
  bindTaskAndActivity(task: any, activity: any) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postTaskByActivities(activity, task)
        .toPromise()
        .then(
          (data) => {
            resolve(data);
          },
          (error) => {
            resolve(error);
          }
        );
    });
    return promise;
  }

  /**
   * Creates the new project and new color for that project
   */
  createProject() {
    const currentDate = new Date();
    const idUser = this.encryptService.desencrypt("idUser");
    const promise = new Promise((resolve) => {
      this.projectService
        .postProject(this.projectName, idUser, currentDate)
        .toPromise()
        .then(
          (response) => {
            this.projectData = response;
            this.postNewProjectColor(response.idProjectsPk);
            this.projectList.push(response);
            resolve(response);
          },
          (error) => {
            resolve(error);
          }
        );
    });
    return promise;
  }

  /**
   * Create a new phase
   * @param phaseName
   * @param idProjectsPk
   */
  createNewPhase(phaseName, idProjectsPk, index) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postPhase(phaseName)
        .toPromise()
        .then(
          (data) => {
            this.phaseList.push(data);
            this.phasesNames[index].idPhase = data.idPhasesPk;
            resolve(data);
          },
          (error) => {
            resolve(error);
          }
        );
    });
    return promise;
  }

  /**
   * Create a new activity
   * @param activity
   * @param idPhasesPk
   */
  createNewActivity(activity, idPhasesPk, index) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postActivity(activity)
        .toPromise()
        .then(
          (data) => {
            this.activityList.push(data);
            this.activitiesNames[index].idActivity = data.idActivityPk;
            resolve(data);
          },
          (error) => {
            resolve(error);
          }
        );
    });
    return promise;
  }

  /**
   * Create a new tast
   * @param task
   */
  createNewTask(task) {
    const promise = new Promise((resolve) => {
      this.projectService
        .postTask(task)
        .toPromise()
        .then(
          (data) => {
            this.taskList.push(data);
            resolve(data);
          },
          (error) => {
            resolve(error);
          }
        );
    });
    return promise;
  }

  /**
   * Resets everything to the initial value
   */
  resetData() {
    this.projectName = "";
    this.tasksNames = [];
    this.phasesNames = [];
    this.activitiesNames = [];
    this.clearFormArray(this.phases);
    this.activityForm.enable();
    this.phaseFormConfig();
    this.taskForm.enable();
    this.taskSelected();
    this.activitySelected();
    this.projectSelected();
    this.nextStep(0);
    this.phaseSelected();
  }

  /**
   * Gets all the values from the forms credencials, and process them on each diferent arrays.
   * after each process it executes the post methodsv since its a hierarchy most post depend on others.
   * @param phaseCredencials
   * @param activitiesCredencials
   * @param tasksCredencials
   */
  async registerNewProject(
    phaseCredencials,
    activitiesCredencials,
    tasksCredencials
  ) {
    let index = 0;
    let phases;
    let activity;
    let task;
    this.newPhase(phaseCredencials);
    const project: any = await this.createProject();
    this.idProject = project.idProjectsPk;
    for (const phaseName of this.phasesNames) {
      phases = await this.createNewPhase(
        phaseName.phaseName,
        project.idProjectsPk,
        index
      );
      await this.bindPhaseAndProject(this.idProject, phases.idPhasesPk);
      index++;
    }
    index = 0;
    this.newActivity(activitiesCredencials);
    for (const activities of this.activitiesNames) {
      activity = await this.createNewActivity(
        activities.activity,
        activities.idPhase,
        index
      );
      await this.bindPhaseAndActivity(
        activities.idPhase,
        activity.idActivityPk
      );
      index++;
    }
    index = 0;
    this.newTask(tasksCredencials);
    for (const tasks of this.tasksNames) {
      task = await this.createNewTask(tasks.task);
      await this.bindTaskAndActivity(task.idTaskPk, tasks.activityId);
      index++;
    }
    this.openCollaborators();
    this.resetData();
    this.openNotificacition(
      "Se agregado el proyecto al registro.",
      "Proyecto registrado.",
      "success"
    );
  }

  /**
   * opens the modal notificacion.
   * @param message
   * @param title
   * @param type
   */
  openNotificacition(message, title, type) {
    const dialogRef = this.dialog.open(LargeNotificationComponent, {
      width: "650px",
      data: {
        title: title,
        message: message,
        type: type,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  /**
   * opens the confirm modal.
   * @param message
   * @param title
   * @param type
   */
  openConfirmAction(item, type, typeItem, binding, indexArray, indexInput) {
    if (item !== undefined) {
      const dialogRef = this.dialog.open(ConfirmEditsComponent, {
        width: "650px",
        data: {
          type: type,
          typeElement: typeItem,
          value: item,
          binding: binding,
          projectName: this.projectName,
          idProject: this.idProject,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === "success") {
          this.openNotificacition(
            "Se modificó la información del proyecto.",
            "Registro Proyecto",
            "success"
          );
          this.evaluteConfirmResult(typeItem, binding);
        } else if (result === "error") {
          this.openNotificacition(
            "Error al intentar modificar la información del proyecto.",
            "Registro Proyecto",
            "warning"
          );
        }
      });
    } else {
      switch (typeItem) {
        case "phase":
          this.deletePhaseInput(indexArray);
          break;
        case "activity":
          this.deleteActivityInput(indexArray, indexInput);
          break;
        case "task":
          this.deleteTasksInput(indexArray, indexInput);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Evalutes which type of element was selected and modified, and recharge the arrays of that types
   * @param typeElement
   * @param binding
   */
  evaluteConfirmResult(typeElement, binding) {
    let objFiltered;
    switch (typeElement) {
      case "phase":
        this.phasesList(this.idProject);
        break;
      case "activity":
        objFiltered = this.phaseList.find(
          (phase) => phase.idPhasesPk === binding.idPhase
        );
        this.phaseEditSelected(objFiltered);
        break;
      case "task":
        objFiltered = this.activityList.find(
          (activity) => activity.idActivityPk === binding.idActivity
        );
        this.activityEditSelected(objFiltered);
        break;
      default:
        break;
    }
  }

  /**
   * opens the modal collaborators.
   * @param type
   */
  openCollaborators() {
    const dialogRef = this.dialog.open(ModalCollaboratorsComponent, {
      width: "650px",
      data: {
        projectName: this.projectName,
        idProjectsPk: this.projectData.idProjectsPk,
        idUnitsFk: this.projectData.idUnitsFk,
        status: this.projectData.status,
        createdBy: this.projectData.createdBy,
        createdAt: this.projectData.createdAt,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.openNotificacition(
          "Se registro la información del proyecto.",
          "Registro Proyecto",
          "success"
        );
      } else if (result === "warning") {
        this.openNotificacition(
          "Error al intentar modificar la información del proyecto. Por favor intentelo en la pantalla de Todos los Proyectos.",
          "Registro Proyecto",
          "warning"
        );
      }
    });
  }

  /**
   * Validates if there has been new phases, tasks and activities added and informs the user
   * @param credencials
   * @param typeElement
   */
  validateNewChanges(credencials, typeElement) {
    let objFiltered;
    switch (typeElement) {
      case "phases":
        const phases = this.processCredencials(credencials.phases, "phases");
        if (this.editedElements.length > 0) {
          this.openAddElements(
            this.editedElements,
            "update",
            "phase",
            this.idProject
          );
        }
        if (phases.length > 0) {
          this.openAddElements(phases, "adding", "phase", this.idProject);
        } else {
          this.openNotificacition(
            "No se han agregado fases nuevas.",
            "Registro Fases",
            "success"
          );
        }
        break;
      case "activities":
        objFiltered = this.phaseList.find(
          (phase) => phase.phaseName === credencials.activities[0].phase
        );
        const activities = this.processCredencials(
          credencials.activities[0].inputActivites,
          "activities"
        );
        if (this.editedElements.length > 0) {
          this.openAddElements(this.editedElements, "update", "activity", {
            phaseName: objFiltered.phaseName,
            idPhase: objFiltered.idPhasesPk,
          });
        }
        if (activities.length > 0) {
          this.openAddElements(activities, "adding", "activity", {
            phaseName: objFiltered.phaseName,
            idPhase: objFiltered.idPhasesPk,
          });
        } else {
          this.openNotificacition(
            "No se han agregado actividades nuevas.",
            "Registro Actividades",
            "success"
          );
        }
        break;
      case "tasks":
        objFiltered = this.activityList.find(
          (activity) => activity.activityName === credencials.tasks[0].activity
        );
        const tasks = this.processCredencials(
          credencials.tasks[0].inputTasks,
          "tasks"
        );
        if (this.editedElements.length > 0) {
          this.openAddElements(this.editedElements, "update", "task", {
            idActivity: objFiltered.idActivityPk,
            activityName: objFiltered.activityName,
          });
        }
        if (tasks.length > 0) {
          this.openAddElements(tasks, "adding", "task", {
            idActivity: objFiltered.idActivityPk,
            activityName: objFiltered.activityName,
          });
        } else {
          this.openNotificacition(
            "No se han agregado tareas nuevas.",
            "Registro Tareas",
            "success"
          );
        }
        break;
      default:
        break;
    }
  }

  /**
   * Process the values of the credencials returning the ones that are not in the existing elements
   * @param credencials
   */
  processCredencials(credencials, typeElement) {
    const newElementAdded = [];
    const editedElements = [];
    this.editedElements = [];
    switch (typeElement) {
      case "phases":
        this.phaseList.forEach((element, index) => {
          if (element.phaseName != credencials[index]) {
            editedElements.push(credencials[index]);
            this.editedElements.push({
              newName: credencials[index],
              oldName: element.phaseName,
              oldData: element,
            });
          }
          newElementAdded.push(element.phaseName);
        });
        break;
      case "activities":
        this.activityList.forEach((element, index) => {
          if (element.activityName != credencials[index]) {
            editedElements.push(credencials[index]);
            this.editedElements.push({
              newName: credencials[index],
              oldName: element.activityName,
              oldData: element,
            });
          }
          newElementAdded.push(element.activityName);
        });
        break;
      case "tasks":
        this.taskList.forEach((element, index) => {
          if (element.taskName != credencials[index]) {
            editedElements.push(credencials[index]);
            this.editedElements.push({
              newName: credencials[index],
              oldName: element.taskName,
              oldData: element,
            });
          }
          newElementAdded.push(element.taskName);
        });
        break;
    }
    const diffElements = credencials.filter(function (obj) {
      return newElementAdded.indexOf(obj) == -1;
    });
    return diffElements.filter(function (obj) {
      return editedElements.indexOf(obj) == -1;
    });
  }

  /**
   * Validates if the name of an element its different from the list of its type
   * @param credencials
   * @param typeElement
   */
  validateElementEdited(credencials, typeElement) {
    const newElementAdded = [];
    switch (typeElement) {
      case "phases":
        credencials.phases.forEach((phase, index) => {
          if (phase !== this.phaseList[index].phaseName) {
            newElementAdded.push({
              newName: phase,
              oldName: this.phaseList[index].phaseName,
            });
          }
        });
        break;
      case "activities":
        credencials.activities[0].inputActivites.forEach((activity, index) => {
          if (activity !== this.activityList[index].activityName) {
            newElementAdded.push({
              newName: activity,
              oldName: this.activityList[index].activityName,
            });
          }
        });
        break;
      case "tasks":
        credencials.tasks[0].inputTasks.forEach((task, index) => {
          if (task !== this.taskList[index].taskName) {
            newElementAdded.push({
              newName: task,
              oldName: this.taskList[index].taskName,
            });
          }
        });
        break;
    }
    return newElementAdded;
  }

  /**
   * Opens the confirm modal asking for the new add elements
   * @param items
   * @param type
   * @param typeItem
   * @param binding
   */
  openAddElements(items, type, typeItem, binding) {
    const dialogRef = this.dialog.open(ConfirmEditsComponent, {
      width: "650px",
      data: {
        type: type,
        typeElement: typeItem,
        value: items,
        binding: binding,
        projectName: this.projectName,
        idProject: this.idProject,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.openNotificacition(
          "Se modificó la información del proyecto.",
          "Registro Proyecto",
          "success"
        );
        this.evaluteConfirmResult(typeItem, binding);
      } else if (result === "error") {
        this.openNotificacition(
          "Error al intentar modificar la información del proyecto.",
          "Registro Proyecto",
          "warning"
        );
      }
    });
  }
}
