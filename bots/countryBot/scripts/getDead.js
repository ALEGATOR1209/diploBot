'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterGraveyard = new FileSync('./databases/graveyard.json');

const getDead = id => (
  id ?
    low(adapterGraveyard)
      .get(`cemetery.${id}`)
      .value() :
    low(adapterGraveyard)
      .get('cemetery')
      .value()
);

module.exports = getDead;
