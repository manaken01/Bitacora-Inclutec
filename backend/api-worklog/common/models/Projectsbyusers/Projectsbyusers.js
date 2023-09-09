"use strict";

const ManageProjects = require("../../user/ManageProjects/ManageProjects");

module.exports = function (projectsbyusers) {
  projectsbyusers.projectsByUser = async function (idUser) {
    const manageProjects = new ManageProjects();

    return await manageProjects.getProjectsByUsers(idUser);
  };

  projectsbyusers.remoteMethod("projectsByUser", {
    description: "Get projects by user",
    accepts: [{ arg: "idUser", type: "number", required: true }],
    http: {
      path: "/projectsByUser",
      verb: "get",
    },
    returns: {
      root: true,
      type: "array",
    },
  });

  projectsbyusers.allUserProjects = async function (idUser) {
    const manageProjects = new ManageProjects();

    return await manageProjects.getAllProjectOfUser(idUser);
  };

  projectsbyusers.remoteMethod("allUserProjects", {
    description: "Get projects by user",
    accepts: [{ arg: "idUser", type: "number", required: true }],
    http: {
      path: "/allUserProjects",
      verb: "get",
    },
    returns: {
      root: true,
      type: "array",
    },
  });

  projectsbyusers.userProjectsPending = async function (idUser) {
    const manageProjects = new ManageProjects();

    return await manageProjects.usersNotProjects(idUser);
  };

  projectsbyusers.remoteMethod("userProjectsPending", {
    description: "Get projects an users hasnt been register to",
    accepts: [{ arg: "idUser", type: "number", required: true }],
    http: {
      path: "/userProjectsPending",
      verb: "get",
    },
    returns: {
      root: true,
      type: "array",
    },
  });
};
