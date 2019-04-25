'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapterGraveyard = new FileSync('./databases/graveyard.json');

const bury = user => low(adapterGraveyard)
  .unset(`cemetery.${user}`)
  .write();

module.exports = bury;
