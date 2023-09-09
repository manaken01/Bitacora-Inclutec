"use strict";

const app = require("../../../server/server");

function ManageProjects() {
  /**
   * Gets all the projects based on a user
   * @param {*} idUser
   */
  this.getProjectsByUsers = async function (idUser) {
    let result = [];
    let usersProject;
    const projectsByUser = await app.models.ProjectsByUsers.find({
      where: { idUsersFk: idUser },
    });
    for (const project of projectsByUser) {
      usersProject = await getProjectById(project.idProjectsFk);
      if (usersProject !== null) {
        result.push(usersProject);
      }
    }
    return await result;
  };

  /**
   * @param {*} idProject
   * Gets a project base on its id
   */
  async function getProjectById(idProject) {
    let projects = app.models.Projects;
    let conditions = {
      where: {
        and: [
          {
            idProjectsPk: idProject,
            status: 1,
          },
        ],
      },
    };
    return await projects.findOne(conditions);
  }

  /**
   * Gets all the projects based on a user even the inactived ones
   * @param {*} idUser
   */
  this.getAllProjectOfUser = async function (idUser) {
    let result = [];
    let usersProject;
    const projectsByUser = await app.models.ProjectsByUsers.find({
      where: { idUsersFk: idUser },
    });
    for (const project of projectsByUser) {
      usersProject = await getProjects(project.idProjectsFk);
      if (usersProject !== null) {
        result.push(usersProject);
      }
    }
    return await result;
  };

  /**
   * @param {*} idProject
   * Gets a project base on its id even if the project its inactive
   */
  async function getProjects(idProject) {
    let projects = app.models.Projects;
    let conditions = {
      where: {
        and: [
          {
            idProjectsPk: idProject,
          },
        ],
      },
    };
    return await projects.findOne(conditions);
  }

  /**
   * Gets all projects on an unit
   * @param {*} idUnit
   */
  this.getProjectsByUnit = async function (idUnit) {
    let result = [];
    const projectsbyunit = await app.models.Projects.find({
      where: { idUnitsFk: idUnit },
    });
    result = projectsbyunit;
    return await result;
  };

  /**
   * Gets all phases of a project
   * @param {*} idProject
   */
  this.getPhasesByProjects = async function (idProject) {
    let result = [];
    const phasesbyprojects = await app.models.PhaseByProjects.find({
      where: { idProjectsFk: idProject },
    });
    for (const phase of phasesbyprojects) {
      let projectsPhase = await getPhaseById(phase.idPhaseFk);
      result.push(projectsPhase);
    }
    return await result;
  };

  /**
   * Gets a phase based on its id
   * @param {*} idPhase
   */
  async function getPhaseById(idPhase) {
    let phases = app.models.Phases;
    let conditions = {
      and: [
        {
          idPhasesPk: idPhase,
        },
      ],
    };
    return await phases.findOne({ where: conditions });
  }

  /**
   * Gets all activities of a phase
   * @param {*} idPhase
   */
  this.getActivityByPhase = async function (idPhase) {
    let result = [];
    const activityByPhases = await app.models.ActivityByPhases.find({
      where: { idPhasesFk: idPhase },
    });
    for (const activity of activityByPhases) {
      let phaseActivity = await getActById(activity.idActivityFk);
      result.push(phaseActivity);
    }
    return await result;
  };

  /**
   * Gets an activity based on its id
   * @param {*} idAct
   */
  async function getActById(idAct) {
    const activity = app.models.Activities;
    const conditions = {
      idActivityPk: idAct,
    };
    return await activity.findOne({ where: conditions });
  }

  /**
   * Gets all task on an activity
   */
  this.getTaskByActivity = async function (idActivity) {
    let result = [];
    const taskByActivity = await app.models.TaskByActivities.find({
      where: { idActivityFk: idActivity },
    });
    for (let task of taskByActivity) {
      let activitiesTask = await getTaskById(task.idTaskFk);
      result.push(activitiesTask);
    }
    return await result;
  };

  /**
   * Gets a task base on its id
   * @param {*} idAct
   */
  async function getTaskById(idAct) {
    const task = app.models.Task;
    const conditions = {
      idTaskPk: idAct,
    };
    return await task.findOne({ where: conditions });
  }

  /**
   * Gets the colors of the projects an users is register to
   */
  this.getProjectsColorsByUser = async function (idUser) {
    let result = [];
    const projectsByUser = await app.models.ProjectsByUsers.find({
      where: { idUsersFk: idUser },
    });
    for (const project of projectsByUser) {
      let projectsColors = await app.models.ProjectsColors.findOne({
        where: { idProjectsFk: project.idProjectsFk },
      });
      if (projectsColors != null) {
        let projectName = await app.models.Projects.findOne({
          where: { idProjectsPk: project.idProjectsFk },
        });
        let data = {
          idProjectsPk: project.idProjectsFk,
          projectName: projectName.projectName,
          primaryColor: projectsColors.primaryColor,
          secondaryColor: projectsColors.secondaryColor,
        };
        result.push(data);
      }
    }
    return await result;
  };

  /**
   * Gets the projects an user is not register
   */
  this.usersNotProjects = async function (idUser) {
    const result = [];
    let exits = false;
    const projects = await app.models.Projects.find();
    const projectsByUser = await app.models.ProjectsByUsers.find({
      where: { idUsersFk: idUser },
    });
    for (const project of projects) {
      for (const usersProject of projectsByUser) {
        if (project.idProjectsPk === usersProject.idProjectsFk) {
          exits = true;
        }
      }
      if (!exits) {
        result.push(project);
      }
      exits = false;
    }
    return result;
  };

  /**
   * Returns all the structure of a project:
   * project name - phases - activities of those phases
   * and how many tasks each activity has
   */
  this.projectsInfo = async function () {
    const projects = app.models.Projects;
    const phaseByProject = app.models.PhaseByProjects;
    const result = [];
    const projectsList = await projects.find();
    let phasesList = [];
    let index = 0;
    for (const project of projectsList) {
      await result.push(project);
      phasesList = await phaseByProject.find({
        where: { idProjectsFk: project.idProjectsPk },
      });
      result[index].creator = await projectCreatorData(result[index].createdBy);
      result[index].collaborators = await processCollaborators(
        project.idProjectsPk
      );
      result[index].structure = await getPhasesStructure(phasesList);
      index++;
    }
    return await result;
  };

  /**
   * Gets the list of phases from a project and returns the data of the phase
   * and the structure of the activities
   * @param {*} phasesList
   */
  async function getPhasesStructure(phasesList) {
    const phases = app.models.Phases;
    const structure = [];
    let activityStructure;
    let phase;
    for (const phaseValue of phasesList) {
      phase = await phases.findOne({
        where: { idPhasesPk: phaseValue.idPhaseFk },
      });
      activityStructure = await getActivitiesStructure(phase.idPhasesPk);
      structure.push({
        phaseName: phase.phaseName,
        idPhasesPk: phase.idPhasesPk,
        activities: activityStructure,
      });
    }
    return structure;
  }

  /**
   * gets the id of the phase which we want to get the data of an activity
   * and returns that data as well as the number of tasks the activity has
   * @param {*} idPhase
   */
  async function getActivitiesStructure(idPhase) {
    const taskByActivity = app.models.TaskByActivities;
    const activityByPhase = app.models.ActivityByPhases;
    const activities = app.models.Activities;
    const structure = [];
    let activityData;
    let taskData;
    const activitiesList = await activityByPhase.find({
      where: { idPhasesFk: idPhase },
    });
    for (const activity of activitiesList) {
      activityData = await activities.findOne({
        where: { idActivityPk: activity.idActivityFk },
      });
      taskData = await taskByActivity.find({
        where: { idActivityFk: activityData.idActivityPk },
      });
      structure.push({
        activityName: activityData.activityName,
        idActivityPk: activityData.idActivityPk,
        tasksByActivity: taskData.length,
      });
    }
    return structure;
  }

  /**
   * Returns the name of the user
   * @param {*} idUser
   */
  async function projectCreatorData(idUser) {
    const users = app.models.Users;
    let createdBy = "";
    const userData = await users.findOne({
      where: { idUsersPk: idUser },
    });
    if (userData !== null) {
      createdBy = userData.name + " " + userData.lastName + ".";
    } else {
      createdBy = "Ninguno";
    }
    return createdBy;
  }

  /**
   * Gets the collaborators of a project
   * @param {*} idProject
   */
  this.projectCollaborators = async function (idProject) {
    const usersByProject = app.models.ProjectsByUsers;
    const users = app.models.Users;
    let collaborators = [];
    let collaboratorData = "";
    const projectList = await usersByProject.find({
      where: { idProjectsFk: idProject },
    });
    for (const projectUser of projectList) {
      collaboratorData = await users.findOne({
        where: { idUsersPk: projectUser.idUsersFk },
      });
      if (collaboratorData !== null) {
        collaborators.push({
          idUser: collaboratorData.idUsersPk,
          name: collaboratorData.name,
          lastName: collaboratorData.lastName,
        });
      }
    }
    return collaborators;
  };

  /**
   * Gets the collaborators of a project
   * @param {*} idProject
   */
  async function processCollaborators(idProject) {
    const usersByProject = app.models.ProjectsByUsers;
    const users = app.models.Users;
    let collaborators = "";
    let collaboratorData = "";
    const projectList = await usersByProject.find({
      where: { idProjectsFk: idProject },
    });
    for (const projectUser of projectList) {
      collaboratorData = await users.findOne({
        where: { idUsersPk: projectUser.idUsersFk },
      });
      if (collaboratorData !== null) {
        collaborators +=
          collaboratorData.name + " " + collaboratorData.lastName + ", ";
      }
    }
    if (collaborators === "") {
      collaborators = "Ninguno, ";
    }
    collaborators = collaborators.slice(0, -1);
    collaborators = collaborators.replace(/.$/, ".");
    return collaborators;
  }

  /**
   * Returns the users which are not working in a project
   * @param {*} idProject
   */
  this.outsiteCollaborators = async function (idProject) {
    const usersByProject = app.models.ProjectsByUsers;
    const users = app.models.Users;
    const result = [];
    let exist = false;
    const usersList = await users.find();
    const projectList = await usersByProject.find({
      where: { idProjectsFk: idProject },
    });
    for (const user of usersList) {
      for (const project of projectList) {
        if (user.idUsersPk === project.idUsersFk) {
          exist = true;
        }
      }
      if (!exist) {
        result.push(user);
      }
      exist = false;
    }
    return result;
  };

  /**
   * Deletes the binding between an user and project
   * @param {*} idUser
   * @param {*} idProject
   */
  this.deleteUserbyProject = async function (idUser, idProject) {
    const usersByProject = app.models.ProjectsByUsers;
    const result = await usersByProject.destroyAll({
      idUsersFk: idUser,
      idProjectsFk: idProject,
    });
    return result;
  };

  /**
   * Deletes the binding between a phase and project
   * @param {*} idPhase
   * @param {*} idProject
   */
  this.deletePhaseByProject = async function (idPhase, idProject) {
    const phaseByProjects = app.models.PhaseByProjects;
    const result = await phaseByProjects.destroyAll({
      idPhaseFk: idPhase,
      idProjectsFk: idProject,
    });
    return result;
  };

  /**
   * Deletes the binding between an activity and phase
   * @param {*} idPhase
   * @param {*} idProject
   */
  this.deleteActivityByPhase = async function (idActivity, idPhase) {
    const activityByPhases = app.models.ActivityByPhases;
    const result = await activityByPhases.destroyAll({
      idActivityFk: idActivity,
      idPhasesFk: idPhase,
    });
    return result;
  };

  /**
   * Deletes the binding between a task and activity
   * @param {*} idPhase
   * @param {*} idProject
   */
  this.deleteTaskByActivity = async function (idTask, idActivity) {
    const taskByActivities = app.models.TaskByActivities;
    const result = await taskByActivities.destroyAll({
      idActivityFk: idActivity,
      idTaskFk: idTask,
    });
    return result;
  };
}

module.exports = ManageProjects;
