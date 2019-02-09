'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterGraveyard = new FileSync(`${databases}/graveyard.json`);

const getDead = id => low(adapterGraveyard)
  .get(id)
  .value();

module.exports = getDead;
