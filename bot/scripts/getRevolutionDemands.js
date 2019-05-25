'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterRevolution = new FileSync('./databases/revolution.json');

const getAdmins = () => low(adapterRevolution)
  .get('REVOLUTION_DEMANDS')
  .value();

module.exports = getAdmins;
