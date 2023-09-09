"use strict";

const ManageDependencies = require("../../user/ManageWorklogs/ManageDependencies");

module.exports = function (Worklogdependencies) {
  /**
   * Gets the pending worklog of a user
   */
  Worklogdependencies.worklogPerUserPending = async function (idUser, cb) {
    const manageDependecies = new ManageDependencies();
    return await manageDependecies.getWorklogPerUserPending(idUser, cb);
  };

  Worklogdependencies.remoteMethod("worklogPerUserPending", {
    description: "Get all worklog pending",
    accepts: [{ arg: "idUser", type: "number", required: true }],
    http: { path: "/allWorklogsPending", verb: "get" },
    returns: { root: true, type: "array" }
  });

  /**
   * Gets the most common work an user has register
   */
  Worklogdependencies.getMostCommon = function (userId, cb) {
    const manageDependecies = new ManageDependencies();
    return manageDependecies.getMostCommonWorklog(userId, cb);
  };

  Worklogdependencies.remoteMethod("getMostCommon", {
    description: "Get most common dependencies",
    accepts: [{ arg: "userId", type: "number", required: true }],
    http: { path: "/getMostCommon", verb: "get" },
    returns: { root: true, type: "array" }
  });

  /*
   * Gets the last 4 work register an user has made
   */
  Worklogdependencies.getLastDependency = function (userId, cb) {
    const manageDependecies = new ManageDependencies();
    return manageDependecies.getLastDependencyWorklog(userId, cb);
  };

  Worklogdependencies.remoteMethod("getLastDependency", {
    description: "Get last dependency",
    accepts: [{ arg: "userId", type: "number", required: true }],
    http: { path: "/getLastDependency", verb: "get" },
    returns: { root: true, type: "array" }
  });

  /**
   * Gets the names of all active projects and the sum of the hours on those projects
   * not based on any user just in a date
   */
  Worklogdependencies.getGeneralProjectsGraph = function (startYear, endYear) {
    const manageDependecies = new ManageDependencies();
    return manageDependecies.getGeneralProjectsGraph(startYear, endYear);
  };

  Worklogdependencies.remoteMethod("getGeneralProjectsGraph", {
    description:
      "Get the data necessary to create the project graph with all projects",
    accepts: [
      { arg: "startYear", type: "Date", required: true },
      { arg: "endYear", type: "Date", required: true },
    ],
    http: { path: "/getGeneralProjectsGraph", verb: "get" },
    returns: { root: true, type: "array" }
  });

  /**
   * Gets the names of actives projects an users has register work on and sum the hours on those projects
   */
  Worklogdependencies.getPersonalProjectsGraph = function (
    idUser,
    startYear,
    endYear
  ) {
    const manageDependecies = new ManageDependencies();
    return manageDependecies.getPersonalProjectsGraph(
      idUser,
      startYear,
      endYear
    );
  };

  Worklogdependencies.remoteMethod("getPersonalProjectsGraph", {
    description:
      "Get the data necessary to create the project graph based on the projects an users has work on",
    accepts: [
      { arg: "userId", type: "number", required: true },
      { arg: "startYear", type: "Date", required: true },
      { arg: "endYear", type: "Date", required: true },
    ],
    http: { path: "/getPersonalProjectsGraph", verb: "get" },
    returns: { root: true, type: "array" }
  });

  /**
   * Filters all the data based on the id of the project given, this function returns
   * the active phases of a project and the hours spent in each phase
   */
  Worklogdependencies.getFilterProjectsGeneralGraph = function (
    startYear,
    endYear,
    idProject
  ) {
    const manageDependecies = new ManageDependencies();
    return manageDependecies.filterProjectsGraphGeneral(
      startYear,
      endYear,
      idProject
    );
  };

  Worklogdependencies.remoteMethod("getFilterProjectsGeneralGraph", {
    description:
      "Filters the data based on a project, so it can be used to create a graph",
    accepts: [
      { arg: "startYear", type: "Date", required: true },
      { arg: "endYear", type: "Date", required: true },
      { arg: "idProject", type: "number", required: true },
    ],
    http: { path: "/getFilterProjectsGeneralGraph", verb: "get" },
    returns: { root: true, type: "array" }
  });

  /**
   * Filtes the projects data to create a graph based on the project phases on which an user
   * has work on
   */
  Worklogdependencies.getFilterPersonalProjectsGraph = function (
    idUser,
    startYear,
    endYear,
    idProject
  ) {
    const manageDependecies = new ManageDependencies();
    return manageDependecies.filterPersonalProjectsGraph(
      idUser,
      startYear,
      endYear,
      idProject
    );
  };

  Worklogdependencies.remoteMethod("getFilterPersonalProjectsGraph", {
    description:
      "Get the data necesary to create the project graph based on the projects an users has work on",
    accepts: [
      { arg: "userId", type: "number", required: true },
      { arg: "startYear", type: "Date", required: true },
      { arg: "endYear", type: "Date", required: true },
      { arg: "idProject", type: "number", required: true },
    ],
    http: { path: "/getFilterPersonalProjectsGraph", verb: "get" },
    returns: { root: true, type: "array" }
  });

  /**
   * Gets the sum of all users active working on projects
   */
  Worklogdependencies.getTotalUsers = function () {
    const manageDependecies = new ManageDependencies();
    return manageDependecies.totalCollaborators();
  };

  Worklogdependencies.remoteMethod("getTotalUsers", {
    description: "Get the number of users active working on all projects",
    accepts: [],
    http: { path: "/getTotalUsers", verb: "get" },
    returns: { root: true, type: "number" }
  });

  /**
   * Gets the sum of all users active working on projects
   */
  Worklogdependencies.getTotalUsersPerProject = function (idProject) {
    const manageDependecies = new ManageDependencies();
    return manageDependecies.collaboratorsPerProject(idProject);
  };

  Worklogdependencies.remoteMethod("getTotalUsersPerProject", {
    description: "Get the number of users active working on a project",
    accepts: [{ arg: "idProject", type: "number", required: true }],
    http: { path: "/getTotalUsersPerProject", verb: "get" },
    returns: { root: true, type: "number" }
  });
};
