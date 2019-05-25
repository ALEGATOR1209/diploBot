'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const getAllCountries = () => low(adapterStates)
  .get('countries')
  .value();

module.exports = getAllCountries;
