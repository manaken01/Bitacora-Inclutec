'use strict';

const app = require('../../../server/server');

function ManageDependencies() {
  /**
   *  @param {*} idUser
   *  @param {*} cb
   *  Gets all of users pending worklogs
   */
  this.getWorklogPerUserPending = async function (idUser, cb) {
    const worklogDepencies = app.models.WorklogDependencies;
    const worklogInfo = app.models.WorklogByUser;
    let result = [];
    let info;
    let dependeciesFilter;
    let idUserFilter = {
      where: {idUsersFk: idUser},
    };
    const dependecies = await worklogInfo.find(idUserFilter);
    for (let worklog of dependecies) {
      dependeciesFilter = {
        where: {idWorklogDependenciesPk: worklog.idWorklogFk},
      };
      info = await worklogDepencies.findOne(dependeciesFilter);
      if (info != null) {
        if (info.status == 1) {
          result.push(info);
        }
      }
    }
    return await result;
  };

  /**
   *  @param {*} idUser
   *  @param {*} cb
   *  Gets all of users pending worklogs
   */
  this.getWorklogPerUserPendingDate = async function (idUser,date, cb) {
    const worklogDepencies = app.models.WorklogDependencies;
    const worklogInfo = app.models.WorklogByUser;
    let result = [];
    let info;
    let dependeciesFilter;
    let idUserFilter = {
      where: {
        idUsersFk: idUser,
        startDate: date},
    };
    const dependecies = await worklogInfo.find(idUserFilter);
    for (let worklog of dependecies) {
      dependeciesFilter = {
        where: {idWorklogDependenciesPk: worklog.idWorklogFk},
      };
      info = await worklogDepencies.findOne(dependeciesFilter);
      if (info != null) {
        if (info.status == 1) {
          result.push(info);
        }
      }
    }
    return await result;
  };

  /**
   *  @param {*} idUser
   *  @param {*} cb
   *  Gets all of an users most commons projects and phases used
   */
  this.getMostCommonWorklog = function (userId, cb) {
    const ds = app.dataSources.mysqlBitacorasDS;
    let sqlQuery = `CALL getMostCommonsDependencies(${userId});`;
    ds.connector.execute(sqlQuery, function (err, data) {
      if (err) return err;
      return cb(null, JSON.parse(JSON.stringify(data[0])));
    });
  };

  /**
   *  @param {*} idUser
   *  @param {*} cb
   *  gets all of an user latests projects and phases used
   */
  this.getLastDependencyWorklog = function (userId, cb) {
    const ds = app.dataSources.mysqlBitacorasDS;
    let sqlQuery = `CALL getLastDependency(${userId});`;
    ds.connector.execute(sqlQuery, function (err, data) {
      if (err) return err;
      return cb(null, JSON.parse(JSON.stringify(data[0])));
    });
  };

  /**
   * @param {*} idUser
   * Gets all the data of an user worklog to display on
   * search module
   */
  this.getSearchWorkLog = async function (idUser) {
    const workLogInfo = [];
    let idUserFilter;
    let projectName;
    let phaseName;
    let activityName;
    let taskName;
    let dependecies;
    let collaborators;
    const workLog = await app.models.WorklogByUser.find({
      where: {idUsersFk: idUser},
    });
    let jIndex = 0;
    for (let index = 0; index < workLog.length; index++) {
      idUserFilter = {
        where: {
          idWorklogDependenciesPk: workLog[index].idWorklogFk,
        },
      };
      dependecies = await app.models.WorklogDependencies.findOne(idUserFilter);
      if (dependecies != null) {
        collaborators = await getCollaborators(
          workLog[index].idWorklogFk,
          idUser,
        );
        projectName = await app.models.Projects.findOne({
          where: {idProjectsPk: dependecies.idProjectsFk},
        });
        phaseName = await app.models.Phases.findOne({
          where: {idPhasesPk: dependecies.idPhaseFk},
        });
        activityName = await app.models.Activities.findOne({
          where: {idActivityPk: dependecies.idActivityFk},
        });
        taskName = await app.models.Task.findOne({
          where: {idTaskPk: dependecies.idTaskFk},
        });
        workLogInfo[jIndex] = {
          projectName: projectName.projectName,
          phaseName: phaseName.phaseName,
          activityName: activityName.activityName,
          taskName: taskName.taskName,
          startDate: dependecies.startDate,
          endDate: dependecies.endDate,
          modality: dependecies.modality,
          status: dependecies.status,
          description: dependecies.description,
          spentTime: dependecies.spentTime,
          collaborator: collaborators,
        };
        jIndex++;
      }
    }
    return workLogInfo;
  };

  /**
   * Retuns a string with the collaborators all together;
   * @param {*} idWorklog
   * @param {*} idUser
   */
  async function getCollaborators(idWorklog, idUser) {
    let collaborators = '';
    let collaboratorData = '';
    const workLog = await app.models.WorklogByUser.find({
      where: {idWorklogFk: idWorklog},
    });
    for (const work of workLog) {
      collaboratorData = await app.models.Users.findOne({
        where: {idUsersPk: work.idUsersFk},
      });
      if (collaboratorData !== null && collaboratorData.idUsersPk !== idUser) {
        collaborators +=
          collaboratorData.name + ' ' + collaboratorData.lastName + ', ';
      }
    }
    if (collaborators === '') {
      collaborators = 'Ninguno, ';
    }
    collaborators = collaborators.slice(0, -1);
    collaborators = collaborators.replace(/.$/, '.');
    return collaborators;
  }

  /**
   * Returns the data of a users worklog based on the project, phase and activity selected
   */
  this.getProyectFilter = async function (
    idUser,
    idProject,
    idPhase,
    idActivity,
  ) {
    let workLogInfo = [];
    let idUserFilter;
    let projectName;
    let phaseName;
    let activityName;
    let taskName;
    let dependecies;
    let collaborators;
    const workLog = await app.models.WorklogByUser.find({
      where: {idUsersFk: idUser},
    });
    let jIndex = 0;
    for (let index = 0; index < workLog.length; index++) {
      idUserFilter = {
        where: {
          idWorklogDependenciesPk: workLog[index].idWorklogFk,
          idProjectsFk: idProject,
          idPhaseFk: idPhase,
          idActivityFk: idActivity,
        },
      };
      dependecies = await app.models.WorklogDependencies.findOne(idUserFilter);
      if (dependecies != null) {
        collaborators = await getCollaborators(
          workLog[index].idWorklogFk,
          idUser,
        );
        projectName = await app.models.Projects.findOne({
          where: {idProjectsPk: dependecies.idProjectsFk},
        });
        phaseName = await app.models.Phases.findOne({
          where: {idPhasesPk: dependecies.idPhaseFk},
        });
        activityName = await app.models.Activities.findOne({
          where: {idActivityPk: dependecies.idActivityFk},
        });
        taskName = await app.models.Task.findOne({
          where: {idTaskPk: dependecies.idTaskFk},
        });
        workLogInfo[jIndex] = {
          projectName: projectName.projectName,
          phaseName: phaseName.phaseName,
          activityName: activityName.activityName,
          taskName: taskName.taskName,
          startDate: dependecies.startDate,
          endDate: dependecies.endDate,
          modality: dependecies.modality,
          status: dependecies.status,
          description: dependecies.description,
          spentTime: dependecies.spentTime,
          collaborator: collaborators,
        };
        jIndex++;
      }
    }
    return workLogInfo;
  };

  /**
   * Filters the worklog of an user based on dates, and projects caracteristics
   */
  this.getDateFilter = async function (
    idUser,
    startDate,
    endDate,
    idProject,
    idPhase,
    idActivity,
  ) {
    let idUserFilter;
    let workLogInfo = [];
    let projectName;
    let phaseName;
    let activityName;
    let taskName;
    let dependecies;
    let collaborators;
    const workLog = await app.models.WorklogByUser.find({
      where: {idUsersFk: idUser},
    });
    let jIndex = 0;
    for (let index = 0; index < workLog.length; index++) {
      idUserFilter = {
        where: {
          and: [
            {
              idWorklogDependenciesPk: workLog[index].idWorklogFk,
            },
            {
              idProjectsFk: idProject,
            },
            {
              idPhaseFk: idPhase,
            },
            {
              idActivityFk: idActivity,
            },
            {
              startDate: {between: [startDate, endDate]},
            },
          ],
        },
      };
      dependecies = await app.models.WorklogDependencies.findOne(idUserFilter);
      if (dependecies != null) {
        collaborators = await getCollaborators(
          workLog[index].idWorklogFk,
          idUser,
        );
        projectName = await app.models.Projects.findOne({
          where: {idProjectsPk: dependecies.idProjectsFk},
        });
        phaseName = await app.models.Phases.findOne({
          where: {idPhasesPk: dependecies.idPhaseFk},
        });
        activityName = await app.models.Activities.findOne({
          where: {idActivityPk: dependecies.idActivityFk},
        });
        taskName = await app.models.Task.findOne({
          where: {idTaskPk: dependecies.idTaskFk},
        });
        workLogInfo[jIndex] = {
          projectName: projectName.projectName,
          phaseName: phaseName.phaseName,
          activityName: activityName.activityName,
          taskName: taskName.taskName,
          startDate: dependecies.startDate,
          endDate: dependecies.endDate,
          modality: dependecies.modality,
          status: dependecies.status,
          description: dependecies.description,
          spentTime: dependecies.spentTime,
          collaborator: collaborators,
        };
        jIndex++;
      }
    }
    return workLogInfo;
  };

  this.projectCalendarFilter = async function (idUser, idProject) {
    let workLogInfo = [];
    let projectName;
    let phaseName;
    let activityName;
    let taskName;
    let dependecies;
    let collaborators;
    let idUserFilter;
    const workLog = await app.models.WorklogByUser.find({
      where: {idUsersFk: idUser},
    });
    let jIndex = 0;
    for (let index = 0; index < workLog.length; index++) {
      idUserFilter = {
        where: {
          and: [
            {
              idWorklogDependenciesPk: workLog[index].idWorklogFk,
            },
            {
              idUsersFk: idUser,
            },
            {
              idProjectsFk: idProject,
            },
          ],
        },
      };
      dependecies = await app.models.WorklogDependencies.findOne(idUserFilter);
      if (dependecies != null) {
        collaborators = await getCollaborators(
          workLog[index].idWorklogFk,
          idUser,
        );
        projectName = await app.models.Projects.findOne({
          where: {idProjectsPk: dependecies.idProjectsFk},
        });
        phaseName = await app.models.Phases.findOne({
          where: {idPhasesPk: dependecies.idPhaseFk},
        });
        activityName = await app.models.Activities.findOne({
          where: {idActivityPk: dependecies.idActivityFk},
        });
        taskName = await app.models.Task.findOne({
          where: {idTaskPk: dependecies.idTaskFk},
        });
        workLogInfo[jIndex] = {
          projectName: projectName.projectName,
          phaseName: phaseName.phaseName,
          activityName: activityName.activityName,
          taskName: taskName.taskName,
          startDate: dependecies.startDate,
          endDate: dependecies.endDate,
          modality: dependecies.modality,
          status: dependecies.status,
          description: dependecies.description,
          spentTime: dependecies.spentTime,
          collaborator: collaborators,
        };
        jIndex++;
      }
    }
    return workLogInfo;
  };

  this.getGeneralProjectsGraph = async function (startDate, endYear) {
    const workLogInfo = [];
    const dataResult = [];
    let dependeciesFilter;
    const workLog = await app.models.WorklogByUser.find();
    for (let index = 0; index < workLog.length; index++) {
      dependeciesFilter = {
        where: {
          and: [
            {
              idWorklogDependenciesPk: workLog[index].idWorklogFk,
            },
            {startDate: {between: [startDate, endYear]}},
          ],
        },
      };
      const dependecies = await app.models.WorklogDependencies.findOne(
        dependeciesFilter,
      );
      if (dependecies != null) {
        const project = await app.models.Projects.findOne({
          where: {idProjectsPk: dependecies.idProjectsFk},
        });
        workLogInfo.push({
          projectName: project.projectName,
          hours: dependecies.spentTime,
        });
      }
    }
    workLogInfo.reduce(function (res, value) {
      if (!res[value.projectName]) {
        res[value.projectName] = {projectName: value.projectName, hours: 0};
        dataResult.push(res[value.projectName]);
      }
      res[value.projectName].hours += value.hours;
      return res;
    }, {});
    return dataResult;
  };

  this.getPersonalProjectsGraph = async function (idUser, startYear, endYear) {
    const workLogInfo = [];
    const dataResult = [];
    const workLog = await app.models.WorklogByUser.find({
      where: {idUsersFk: idUser},
    });
    let idUserFilter;
    for (let index = 0; index < workLog.length; index++) {
      idUserFilter = {
        where: {
          and: [
            {
              idWorklogDependenciesPk: workLog[index].idWorklogFk,
            },

            {startDate: {between: [startYear, endYear]}},
          ],
        },
      };
      const dependecies = await app.models.WorklogDependencies.findOne(
        idUserFilter,
      );
      if (dependecies != null) {
        const project = await app.models.Projects.findOne({
          where: {idProjectsPk: dependecies.idProjectsFk},
        });
        workLogInfo.push({
          projectName: project.projectName,
          hours: dependecies.spentTime,
        });
      }
    }
    workLogInfo.reduce(function (res, value) {
      if (!res[value.projectName]) {
        res[value.projectName] = {projectName: value.projectName, hours: 0};
        dataResult.push(res[value.projectName]);
      }
      res[value.projectName].hours += value.hours;
      return res;
    }, {});
    return dataResult;
  };

  this.filterProjectsGraphGeneral = async function (
    startDate,
    endYear,
    idProject,
  ) {
    const workLogInfo = [];
    const dataResult = [];
    let dependeciesFilter;
    const workLog = await app.models.WorklogByUser.find();
    for (let index = 0; index < workLog.length; index++) {
      dependeciesFilter = {
        where: {
          and: [
            {
              idWorklogDependenciesPk: workLog[index].idWorklogFk,
            },
            {
              idProjectsFk: idProject,
            },
            {startDate: {between: [startDate, endYear]}},
          ],
        },
      };
      const dependecies = await app.models.WorklogDependencies.findOne(
        dependeciesFilter,
      );
      if (dependecies != null) {
        const phase = await app.models.Phases.findOne({
          where: {idPhasesPk: dependecies.idPhaseFk},
        });
        workLogInfo.push({
          phaseName: phase.phaseName,
          hours: dependecies.spentTime,
        });
      }
    }
    workLogInfo.reduce(function (res, value) {
      if (!res[value.phaseName]) {
        res[value.phaseName] = {phaseName: value.phaseName, hours: 0};
        dataResult.push(res[value.phaseName]);
      }
      res[value.phaseName].hours += value.hours;
      return res;
    }, {});
    return dataResult;
  };

  this.filterPersonalProjectsGraph = async function (
    idUser,
    startYear,
    endYear,
    idProject,
  ) {
    const workLogInfo = [];
    const dataResult = [];
    const workLog = await app.models.WorklogByUser.find({
      where: {
        idUsersFk: idUser,
      },
    });
    let idUserFilter;
    for (let index = 0; index < workLog.length; index++) {
      idUserFilter = {
        where: {
          and: [
            {
              idWorklogDependenciesPk: workLog[index].idWorklogFk,
            },
            {
              idProjectsFk: idProject,
            },
            {startDate: {between: [startYear, endYear]}},
          ],
        },
      };
      const dependecies = await app.models.WorklogDependencies.findOne(
        idUserFilter,
      );
      if (dependecies != null) {
        const phase = await app.models.Phases.findOne({
          where: {idPhasesPk: dependecies.idPhaseFk},
        });
        workLogInfo.push({
          phaseName: phase.phaseName,
          hours: dependecies.spentTime,
        });
      }
    }
    workLogInfo.reduce(function (res, value) {
      if (!res[value.phaseName]) {
        res[value.phaseName] = {phaseName: value.phaseName, hours: 0};
        dataResult.push(res[value.phaseName]);
      }
      res[value.phaseName].hours += value.hours;
      return res;
    }, {});
    return dataResult;
  };

  this.totalCollaborators = async function () {
    let UsersData;
    const usersArray = [];
    const dataResult = [];
    const usersPerProject = await app.models.ProjectsByUsers.find();
    let idUserFilter;
    for (let index = 0; index < usersPerProject.length; index++) {
      idUserFilter = {
        where: {
          idUsersPk: usersPerProject[index].idUsersFk,
        },
      };
      UsersData = await app.models.Users.findOne(idUserFilter);
      if (UsersData != null) {
        if (UsersData.emailVerified == 1 && UsersData.isActive == 1) {
          usersArray.push({
            userId: UsersData.idUsersPk,
          });
        }
      }
    }
    usersArray.reduce(function (res, value) {
      if (!res[value.userId]) {
        res[value.userId] = {userId: value.userId};
        dataResult.push(res[value.userId]);
      }
      return res;
    }, {});
    return dataResult.length;
  };

  this.collaboratorsPerProject = async function (idProject) {
    let UsersData;
    const usersArray = [];
    const dataResult = [];
    const projectFilter = {
      where: {idProjectsFk: idProject},
    };
    const usersPerProject = await app.models.ProjectsByUsers.find(
      projectFilter,
    );
    let idUserFilter;
    for (let index = 0; index < usersPerProject.length; index++) {
      idUserFilter = {
        where: {
          idUsersPk: usersPerProject[index].idUsersFk,
        },
      };
      UsersData = await app.models.Users.findOne(idUserFilter);
      if (UsersData != null) {
        if (UsersData.emailVerified == 1 && UsersData.isActive == 1) {
          usersArray.push({
            userId: UsersData.idUsersPk,
          });
        }
      }
    }
    usersArray.reduce(function (res, value) {
      if (!res[value.userId]) {
        res[value.userId] = {userId: value.userId};
        dataResult.push(res[value.userId]);
      }
      return res;
    }, {});
    return dataResult.length;
  };
}

module.exports = ManageDependencies;
