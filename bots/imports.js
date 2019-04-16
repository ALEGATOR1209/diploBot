'use strict';

const commands = 'commands';
const scripts = 'scripts';
const cb = 'countryBot';
const db = 'diploBot';
const exporter = {
  countryBot: {
    commands: module => require(`./${cb}/${commands}/${module}`),
    scripts: script => require(`./${cb}/${scripts}/${script}`),
  },
  diploBot: {
    commands: module => require(`./${db}/${commands}/${module}`),
    scripts: script => require(`./${db}/${scripts}/${script}`),
  },
  few: (bot, type, list) => list.reduce((obj, key) =>
    (obj[key] = exporter[bot][type](key), obj), {}
  ),
};

module.exports = exporter;
