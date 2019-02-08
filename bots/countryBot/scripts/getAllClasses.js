'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const getAllClasses = country => low(adapterStates)
  .get(`countries.${country}.classes`)
  .value();

module.exports = getAllClasses;
