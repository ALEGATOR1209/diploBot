'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const setMigrationClass = (country, name) => low(adapterStates)
  .get(`countries.${country}`)
  .set('migrantClass', name)
  .write();

module.exports = setMigrationClass;
