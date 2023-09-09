"use strict";

const ManageToDo = require("../../user/ManageWorklogs/ManageToDo");

module.exports = function(Worktodo) {
  Worktodo.toDoPerUser = async function(idUser, urgent, important) {
    const manageTodo = new ManageToDo();

    return await manageTodo.getToDoPerUser(idUser, urgent, important);
  };

  Worktodo.remoteMethod("toDoPerUser", {
    description: "Get to do per categories.",
    accepts: [
      { arg: "idUser", type: "number", required: true },
      { arg: "urgent", type: "number", required: true },
      { arg: "important", type: "number", required: true }
    ],
    http: {
      path: "/allToDoPerUser",
      verb: "get"
    },
    returns: {
      root: true,
      type: "array"
    }
  });

  Worktodo.allToDoPerUser = async function(idUser) {
    const manageTodo = new ManageToDo();

    manageTodo.getAllToDoPerUser(idUser);
  };

  Worktodo.remoteMethod("allToDoPerUser", {
    description: "Get all work to do per user.",
    accepts: [{ arg: "idUser", type: "number", required: true }],
    http: {
      path: "/allToDo",
      verb: "get"
    },
    returns: {
      root: true,
      type: "array"
    }
  });

  Worktodo.changeStatus = async function(idToDo) {
    const manageTodo = new ManageToDo();

    manageTodo.putChangeStatus(idToDo);
  };

  Worktodo.remoteMethod("changeStatus", {
    description: "Change work to do status",
    accepts: [
      {
        arg: "idToDo",
        type: "number",
        required: true
      }
    ],
    http: {
      path: "/change-status",
      verb: "patch"
    },
    returns: {
      root: true,
      type: "string"
    }
  });
};
