'use strict';

const commands = 'commands';
const scripts = 'scripts';
const actions = 'actions';
const importer = {
  countryBot: {
    commands: module => require(`./${commands}/${module}/${module}`),
    scripts: script => require(`./${scripts}/${script}`),
    actions: action => require(`./${actions}/${action}`),
  },
  few: (bot, type, list) => list.reduce((obj, key) =>
    (obj[key] = importer[bot][type](key), obj), {}
  ),
};

module.exports = importer;
