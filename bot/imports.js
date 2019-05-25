'use strict';

const commands = 'commands';
const scripts = 'scripts';
const actions = 'actions';

const importer = {
  commands: module => require(`./${commands}/${module}/${module}`),
  scripts: script => require(`./${scripts}/${script}`),
  actions: action => require(`./${actions}/${action}`),
};

module.exports = importer;
