'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterExecution = new FileSync('./databases/executions.json');

const getExecution = () => low(adapterExecution)
  .get('executions')
  .value();

module.exports = getExecution;
