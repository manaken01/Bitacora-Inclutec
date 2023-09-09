"use strict";

const ManageProjects = require("../../user/ManageProjects/ManageProjects");

module.exports = function (projects) {
  projects.projectsByUnit = async function (idUnit) {
    const manageProjects = new ManageProjects();

    return await manageProjects.getProjectsByUnit(idUnit);
  };

  projects.remoteMethod("projectsByUnit", {
    description: "Get projects by unit",
    accepts: [{ arg: "idUnit", type: "number", required: true }],
    http: {
      path: "/projectsByUnit",
      verb: "get",
    },
    returns: { root: true, type: "array" },
  });

  projects.projectsInfo = async function () {
    const manageProjects = new ManageProjects();

    return await manageProjects.projectsInfo();
  };

  projects.remoteMethod("projectsInfo", {
    description: "Get projects by unit",
    accepts: [],
    http: {
      path: "/projectsInfo",
      verb: "get",
    },
    returns: { root: true, type: "array" },
  });

  projects.projectCollaborators = async function (idProject) {
    const manageProjects = new ManageProjects();

    return await manageProjects.projectCollaborators(idProject);
  };

  projects.remoteMethod("projectCollaborators", {
    description: "Gets the collaborators of a project",
    accepts: [{ arg: "idProject", type: "number", required: true }],
    http: {
      path: "/projectCollaborators",
      verb: "get",
    },
    returns: { root: true, type: "string" },
  });

  projects.outsiteCollaborators = async function (idProject) {
    const manageProjects = new ManageProjects();

    return await manageProjects.outsiteCollaborators(idProject);
  };

  projects.remoteMethod("outsiteCollaborators", {
    description: "Gets the collaborators outside of a project",
    accepts: [{ arg: "idProject", type: "number", required: true }],
    http: {
      path: "/outsiteCollaborators",
      verb: "get",
    },
    returns: { root: true, type: "array" },
  });

  projects.deleteUserbyProject = async function (idUser, idProject) {
    const manageProjects = new ManageProjects();

    return await manageProjects.deleteUserbyProject(idUser, idProject);
  };

  projects.remoteMethod("deleteUserbyProject", {
    description: "Deletes the binding between an user and project",
    accepts: [
      { arg: "idUser", type: "number", required: true },
      { arg: "idProject", type: "number", required: true },
    ],
    http: {
      path: "/deleteUserbyProject",
      verb: "delete",
    },
    returns: { root: true, type: "array" },
  });

  projects.deletePhaseByProject = async function (idPhase, idProject) {
    const manageProjects = new ManageProjects();

    return await manageProjects.deletePhaseByProject(idPhase, idProject);
  };

  projects.remoteMethod("deletePhaseByProject", {
    description: "Deletes the binding between a phase and project",
    accepts: [
      { arg: "idPhase", type: "number", required: true },
      { arg: "idProject", type: "number", required: true },
    ],
    http: {
      path: "/deletePhaseByProject",
      verb: "delete",
    },
    returns: { root: true, type: "array" },
  });

  projects.deleteActivityByPhase = async function (idActivity, idPhase) {
    const manageProjects = new ManageProjects();

    return await manageProjects.deleteActivityByPhase(idActivity, idPhase);
  };

  projects.remoteMethod("deleteActivityByPhase", {
    description: "Deletes the binding between an activity and phase",
    accepts: [
      { arg: "idActivity", type: "number", required: true },
      { arg: "idPhase", type: "number", required: true },
    ],
    http: {
      path: "/deleteActivityByPhase",
      verb: "delete",
    },
    returns: { root: true, type: "array" },
  });

  projects.deleteTaskByActivity = async function (idTask, idActivity) {
    const manageProjects = new ManageProjects();

    return await manageProjects.deleteTaskByActivity(idTask, idActivity);
  };

  projects.remoteMethod("deleteTaskByActivity", {
    description: "Deletes the binding between a task and activity",
    accepts: [
      { arg: "idTask", type: "number", required: true },
      { arg: "idActivity", type: "number", required: true },
    ],
    http: {
      path: "/deleteTaskByActivity",
      verb: "delete",
    },
    returns: { root: true, type: "array" },
  });
};
