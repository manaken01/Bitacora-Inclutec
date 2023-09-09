
'use strict';

const ManageProjects = require('../../user/ManageProjects/ManageProjects');

module.exports = function (PhaseByProjects) {

  PhaseByProjects.phasesByProject = async function(idProject) {

    const manageProjects = new ManageProjects();

    return await manageProjects.getPhasesByProjects(idProject);

  }


  PhaseByProjects.remoteMethod('phasesByProject', {
    description: 'Get phases by projects',
    accepts: [
      { arg: 'idProject', type: 'number', required: true }
    ],
    http: {
      path: '/phasesByProject',
      verb: 'get'
    },
    returns: {
      root: true,
      type: 'array'
    }
  })
}