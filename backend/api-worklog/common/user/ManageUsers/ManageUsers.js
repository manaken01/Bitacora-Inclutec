"use strict";

const app = require("../../../server/server");
const _ = require("lodash");

function ManageUser() {
  /**
   * Gets the users data
   */
  this.userInfo = async function (idUser) {
    const user = await app.models.Users.findOne({
      where: { idUsersPk: idUser },
    });
    return user;
  };

  /**
   * Gets the data of active collaborators
   */
  this.getCollaborators = async function (idUser) {
    const user = await app.models.Users.find({
      where: { isActive: 1 },
    });
    return user;
  };

  /**
   * Updates the user data
   */
  this.updateUser = async function (userToUpdate) {
    const userModel = app.models.Users;
    let userUpdated = await userModel.update(
      {
        idUsersPk: userToUpdate.idUsersPk,
      },
      userToUpdate
    );
    userUpdated = await userModel.update(
      {
        idUsersPk: userToUpdate.idUsersPk,
      },
      {
        emailVerified: 1,
      }
    );
    return userUpdated;
  };

  /**
   * Sends an email requesting the collaboration into a project
   */
  this.requestProject = async function (idUser, projectName) {
    const userData = await app.models.Users.findOne({
      where: { idUsersPk: idUser },
    });
    const users = app.models.Users;
    users.app.models.Email.send(
      {
        to: "inclutec.bitacoras@gmail.com",
        subject: "[Bitacora] Solicitud",
        html:
          "<h1>Saludos cordiales</h1> " +
          `<p>Se le informa que el usuario <b>${userData.name} ${userData.lastName}</b> <br>` +
          `ha solicitado el colaborar en el proyecto: <b>${projectName}</b></p>
          
          <h2>Gracias por su atención!</h2>`,
        user: userData,
      },
      function (err) {
        if (err) return console.log("> error sending password reset email");
      }
    );
  };

  this.changePassword = async function (email) {
    const userData = await app.models.Users.findOne({
      where: { email: email },
    });
    const users = app.models.Users;
    users.app.models.Email.send(
      {
        to: email,
        subject: "[Bitacora] Solicitud",
        html:
          "<h1>Saludos cordiales</h1> " +
          `<p>Contraseña para uso temporal: hola</b></p>
          
          <h2>Gracias por su atención!</h2>`,
        user: userData,
      },
      function (err) {
        if (err) return console.log("> error sending password reset email");
      }
    );
  };
}

module.exports = ManageUser;
