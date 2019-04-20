'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const getRevolution = (country, id) => low(adapterStates)
  .get(`countries.${country}.revolution.${id}`)
  .value();
module.exports = getRevolution;
