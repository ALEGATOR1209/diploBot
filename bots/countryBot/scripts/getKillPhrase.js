'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterKills = new FileSync('./databases/kills.json');

const getOrders = success => low(adapterKills)
  .get(success ? 'success' : 'fail')
  .value();

module.exports = getOrders;
