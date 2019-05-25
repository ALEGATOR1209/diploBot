'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const getMigrationClass = country => low(adapterStates)
  .get(`countries.${country}.migrantClass`)
  .value();

module.exports = getMigrationClass;
