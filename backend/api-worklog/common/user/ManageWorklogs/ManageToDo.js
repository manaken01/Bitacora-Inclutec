"use strict";

const app = require("../../../server/server");

function ManageToDo() {
  /**
   *  @param {*} idUser
   *  @param {*} urgent
   *  @param {*} importanter
   *  Function that gets all of an users to do list
   */
  this.getToDoPerUser = async function(idUser, urgent, important) {
    let result = [];
    let toDo = await app.models.WorkToDo.find({
      where: {
        and: [
          { idUsersFk: idUser },
          { important: important },
          { urgent: urgent }
        ]
      }
    });
    result = toDo;
    return await result;
  };

  /**
   *  @param {*} idUser
   *  Gets all of the to do list per user
   */
  this.getAllToDoPerUser = async function(idUser) {
    let result = [];
    var toDo = await app.models.WorkToDo.find({
      where: { and: [{ idUsersFk: idUser }, { status: 1 }] }
    });
    result = toDo;
    return await result;
  };

  /**
   *  @param {*} idUser
   *  Change the status of a to do list item
   */
  this.putChangeStatus = async function(idToDo) {
    app.models.WorkToDo.update({ idWorkToDo_pk: idToDo }, { status: "hecho" });
    return await "Success";
  };
}

module.exports = ManageToDo;
