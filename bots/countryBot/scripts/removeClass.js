'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const removeClass = (country, name) => low(adapterStates)
  .unset(`countries.${country}.classes.${name}`)
  .write();

module.exports = removeClass;
