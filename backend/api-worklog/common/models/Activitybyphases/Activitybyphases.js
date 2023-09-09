
'use strict';

const ManageProjects = require('../../user/ManageProjects/ManageProjects');

module.exports = function (ActivityByPhases) {
  ActivityByPhases.activityByPhase = async function (idPhase) {

    const manageProjects = new ManageProjects();

    return await manageProjects.getActivityByPhase(idPhase);

  }


  ActivityByPhases.remoteMethod('activityByPhase', {
    description: 'Get activities by phases',
    accepts: [
      { arg: 'idPhase', type: 'number', required: true }
    ],
    http: {
      path: '/activityByPhase',
      verb: 'get'
    },
    returns: {
      root: true,
      type: 'array'
    }
  })

};