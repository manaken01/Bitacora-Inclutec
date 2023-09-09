"use strict";

const app = require("../../../server/server");

const ManageDependencies = require("../../user/ManageWorklogs/ManageDependencies");

module.exports = function (WorklogByUser) {
  /**
   * Searchs the worklog info o a user
   */
  WorklogByUser.getSearchWorkLog = async function (idUser) {
    const manageDependecies = new ManageDependencies();
    return await manageDependecies.getSearchWorkLog(idUser);
  };

  WorklogByUser.remoteMethod("getSearchWorkLog", {
    description: "Gets all worklog info of a user",
    accepts: [{ arg: "idUser", type: "number", required: true }],
    http: { path: "/getSearchWorkLog", verb: "get" },
    returns: { root: true, type: "Array" },
  });

  /**
   * Filter the worklog of a user based on the project, phase and activity given
   */
  WorklogByUser.getProyectFilter = async function (
    idUser,
    idProject,
    idPhase,
    idActivity
  ) {
    const manageDependecies = new ManageDependencies();
    return await manageDependecies.getProyectFilter(
      idUser,
      idProject,
      idPhase,
      idActivity
    );
  };

  WorklogByUser.remoteMethod("getProyectFilter", {
    description:
      "Gets filters the search option based on project, phase and activity",
    accepts: [
      { arg: "idUser", type: "number", required: true },
      { arg: "idProject", type: "number", required: true },
      { arg: "idPhase", type: "number", required: true },
      { arg: "idActivity", type: "number", required: true },
    ],
    http: { path: "/getProyectFilter", verb: "get" },
    returns: { root: true, type: "Array" },
  });

  /**
   * Filters the search workog of a user based on the prohjec relatives and also
   * by dates
   */
  WorklogByUser.getDateFilter = async function (
    idUser,
    startDate,
    endDate,
    idProject,
    idPhase,
    idActivity
  ) {
    const manageDependecies = new ManageDependencies();
    return await manageDependecies.getDateFilter(
      idUser,
      startDate,
      endDate,
      idProject,
      idPhase,
      idActivity
    );
  };

  WorklogByUser.remoteMethod("getDateFilter", {
    description:
      "Gets filters the search option based on project, phase and activity",
    accepts: [
      { arg: "idUser", type: "number", required: true },
      { arg: "startDate", type: "Date", required: true },
      { arg: "endDate", type: "Date", required: true },
      { arg: "idProject", type: "number", required: true },
      { arg: "idPhase", type: "number", required: true },
      { arg: "idActivity", type: "number", required: true },
    ],
    http: { path: "/getDateFilter", verb: "get" },
    returns: { root: true, type: "Array" },
  });

  /**
   * filters the users project based on the project selected
   */
  WorklogByUser.getProyectsCalendarFilter = async function (idUser, idProject) {
    const manageDependecies = new ManageDependencies();
    return await manageDependecies.projectCalendarFilter(idUser, idProject);
  };

  WorklogByUser.remoteMethod("getProyectsCalendarFilter", {
    description: "Filters the worklog history based projects of an user ",
    accepts: [
      { arg: "idUser", type: "number", required: true },
      { arg: "idProject", type: "number", required: true },
    ],
    http: { path: "/getProyectsCalendarFilter", verb: "get" },
    returns: { root: true, type: "Array" },
  });
};
