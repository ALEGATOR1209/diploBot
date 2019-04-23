'use strict';

'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const getOrders = country => low(adapterStates)
  .get(`countries.${country}.orders`)
  .value();

module.exports = getOrders;
