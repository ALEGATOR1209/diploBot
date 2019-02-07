'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/states.json`);

const getStates = user => low(adapterStates)
  .get(user)
  .value();

module.exports = getStates;
