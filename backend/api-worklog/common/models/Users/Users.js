"use strict";

const ManageUsers = require("../../user/ManageUsers/ManageUsers");

module.exports = function (Users) {
  /**
   * after the create users send an email
   */
  Users.afterRemote("create", async function (context, user, next) {
    user.verificationToken = randomString(
      32,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    await user.save();
    Users.app.models.Email.send(
      {
        to: user.email,
        subject: "[Bitacora] Registro",
        html:
          "<h1>Gracias por registrarse!</h1> " +
          "<p>Para confirmar su registro " +
          `por favor visite el siguiente link http://18.191.140.164:5380/#/login?uid=${user.idUsersPk}&token=${user.verificationToken}</p> `,
        user: user,
      },
      function (err) {
        if (err) return console.log("> error sending password reset email");
      }
    );
  });

  /**
   * Generates a random number
   * @param {*} length
   * @param {*} chars
   */
  function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  /**
   * Gets the users info
   */
  Users.getUsersInfo = async function (idUser) {
    const manageUsers = new ManageUsers();

    return await manageUsers.userInfo(idUser);
  };

  Users.remoteMethod("getUsersInfo", {
    description: "Gets all info of a user",
    accepts: [{ arg: "idUser", type: "number", required: true }],
    http: { path: "/getUsersInfo", verb: "get" },
    returns: { root: true, type: "Array" },
  });

  /**
   * Updates the data of an user
   * @param {*} userToUpdate
   */
  Users.updateUser = async function (userToUpdate) {
    const manageUsers = new ManageUsers();

    return await manageUsers.updateUser(userToUpdate);
  };

  Users.remoteMethod("updateUser", {
    description: "Update user data",
    accepts: [
      {
        arg: "userToUpdate",
        type: "any",
        http: { source: "body" },
        required: true,
      },
    ],
    http: { path: "/updateUser", verb: "post" },
    returns: { root: true, type: "Object" },
  });

  /**
   * Sends an email request to work on a project
   * @param {*} idUser
   * @param {*} projectName
   */
  Users.sendRequestProject = async function (idUser, projectName) {
    const manageUsers = new ManageUsers();

    return await manageUsers.requestProject(idUser, projectName);
  };

  Users.remoteMethod("sendRequestProject", {
    description: "Gets all info of a user",
    accepts: [
      { arg: "idUser", type: "number", required: true },
      { arg: "projectName", type: "any", required: true },
    ],
    http: { path: "/sendRequestProject", verb: "get" },
    returns: { root: true, type: "Array" },
  });

  /**
   * Gets all the active collaborators
   */
  Users.getCollaborators = async function () {
    const manageUsers = new ManageUsers();

    return await manageUsers.getCollaborators();
  };

  Users.remoteMethod("getCollaborators", {
    description: "Gets all info of a user",
    accepts: [],
    http: { path: "/getCollaborators", verb: "get" },
    returns: { root: true, type: "Array" },
  });
};
