
'use strict';

const ManageProjects = require('../../user/ManageProjects/ManageProjects');

module.exports = function (TaskByActivities) {
  
  TaskByActivities.taskByActivity = async function (idActivity) {

    const manageProjects = new ManageProjects();

    return await manageProjects.getTaskByActivity(idActivity);

  }

  TaskByActivities.remoteMethod('taskByActivity', {
    description: 'Get tasks activity',
    accepts: [
      { arg: 'idActivity', type: 'number', required: true }
    ],
    http: {
      path: '/taskByActivity',
      verb: 'get'
    },
    returns: {
      root: true,
      type: 'array'
    }
  })

};