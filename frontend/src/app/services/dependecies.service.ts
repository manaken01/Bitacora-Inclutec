import { Injectable, Inject } from '@angular/core';

@Injectable()
class DependenciesService {
  public projectId: any;
  public phaseId: any;
  public activityId: any;
  public taskId: any;
  public dependenciesId: any;

  constructor(
  ) {
    this.projectId = 0;
    this.phaseId = 0;
    this.activityId = 0;
    this.taskId = 0;
    this.dependenciesId = 0;
  }

  setProjectId(projectId: string) {
    this.projectId = +projectId;
  }

  setPhaseId(phaseId: string) {
    this.phaseId = +phaseId;
  }

  setActivityId(activityId: string) {
    this.activityId = +activityId;
  }

  setTaskId(taskId: string) {
    this.taskId = +taskId;
  }
  setDependenciesId(dependenciesId: string) {
    this.dependenciesId = +dependenciesId;
  }

  getProjectId() {
    return this.projectId;
  }

  getPhaseId() {
    return this.phaseId;
  }

  getActivityId() {
    return this.activityId;
  }

  getTaskId() {
    return this.taskId;
  }
  getDependeciesId() {
    return this.dependenciesId;
  }

}
export { DependenciesService };
