"use strict";

const ManageProjects = require("../../user/ManageProjects/ManageProjects");

module.exports = function (projectsColors) {
  /**
   * Gets the projects of a users and colors of that project
   */
  projectsColors.projectsColors = async function (idUser) {
    const manageProjects = new ManageProjects();

    return await manageProjects.getProjectsColorsByUser(idUser);
  };

  projectsColors.remoteMethod("projectsColors", {
    description: "Get the colors of the projects user",
    accepts: [{ arg: "idUser", type: "number", required: true }],
    http: {
      path: "/projectsColors",
      verb: "get",
    },
    returns: {
      root: true,
      type: "array",
    },
  });
};
