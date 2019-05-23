'use strict';

const commands = 'commands';
const scripts = 'scripts';
const actions = 'actions';
const cb = 'countryBot';
const importer = {
  countryBot: {
    commands: module => require(`./${cb}/${commands}/${module}/${module}`),
    scripts: script => require(`./${cb}/${scripts}/${script}`),
    actions: action => require(`./${cb}/${actions}/${action}`),
  },
  few: (bot, type, list) => list.reduce((obj, key) =>
    (obj[key] = importer[bot][type](key), obj), {}
  ),
};

module.exports = importer;
