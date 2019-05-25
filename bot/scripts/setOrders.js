'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const setOrders = (country, orders) => low(adapterStates)
  .set(`countries.${country}.orders`, orders)
  .write();

module.exports = setOrders;
