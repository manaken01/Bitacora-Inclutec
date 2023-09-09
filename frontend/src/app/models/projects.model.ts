class Project {
  idProjectsPk: any;
  projectName: string;
  idUnitsFk: any;
}

class ProjectColors {
  idProjectsFk: any;
  primaryColor: any;
  secondaryColor: any;
}

class Phase {
  idPhasesPk: any;
  phaseName: string;
  idUnitsFk: any;
}

class PhaseByProject {
  idPhaseFk: any;
  idProjectsFk: any;
}

class Activity {
  idActivityPk: any;
  activityName: string;
  idUnitsFk: any;
}

class ActivityByPhase {
  idActivityFk: any;
  idPhasesFk: any;
}

class Task {
  idTaskPk: any;
  taskName: string;
  idUnitsFk: any;
}

class TaskByActivity {
  idActivityFk: any;
  idTaskFk: any;
}

export {
  Project,
  ProjectColors,
  Phase,
  PhaseByProject,
  Activity,
  ActivityByPhase,
  Task,
  TaskByActivity,
};
