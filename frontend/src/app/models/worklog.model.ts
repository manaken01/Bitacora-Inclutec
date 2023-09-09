class WorklogInfoModel {
  WorklogInfo_pk: number;
  workloginfo_dependencies_fk: number;
  startDate: string;
  description: string;
  startHour: string;
  spentTime: number;
  cost: number;
  modality: number;
}

class WorklogDependencies {
  projectName: string;
  phaseName: string;
  activityName: string;
  taskName: string;
}

class WorkTODO {
  idWorkToDo_pk: number;
  toDoDate: string;
  description: string;
  status: string;
  idUsersFk: number;
  important: number;
  urgent: number;
}

class PostWorklog {
  WorklogInfo_pk: number;
  workloginfo_dependencies_fk: number;
  startDate: string;
  description: string;
  startHour: string;
  spentTime: number;
  cost: number;
  modality: number;
  status: number;
}

class SearchWorkLog {
  projectName: string;
  phaseName: string;
  activityName: string;
  taskName: string;
  startDate: string;
  modality: number;
  status: number;
  description: string;
  spentTime: number;
  collaborator: string;
}

class PostDependencies {
  idWorklogDependenciesPk: number;
  worklogdependecies_users_fk: number;
  Projects_fk: number;
  Phase_fk: number;
  Activity_fk: number;
  Task_fk: number;
  todoDependency: number;
}

class GraphWork {
  projectName: string;
  hours: any;
}

export {
  WorklogInfoModel,
  WorklogDependencies,
  PostWorklog,
  PostDependencies,
  WorkTODO,
  SearchWorkLog,
  GraphWork,
};
