'use strict';

const commands = 'commands';
const scripts = 'scripts';
const actions = 'actions';
const cb = 'countryBot';
const exporter = {
  countryBot: {
    commands: module => require(`./${cb}/${commands}/${module}`),
    scripts: script => require(`./${cb}/${scripts}/${script}`),
    actions: action => require(`./${cb}/${actions}/${action}`),
  },
  few: (bot, type, list) => list.reduce((obj, key) =>
    (obj[key] = exporter[bot][type](key), obj), {}
  ),
};

module.exports = exporter;
