'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const jail = (country, user, arrested = true) => low(adapterStates)
  .get(`countries.${country}.citizens.${user}`)
  .set('inPrison', arrested)
  .write();

module.exports = jail;
