'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const setRevolution = (country, revolution = null, fired = false) => {
  const countries = low(adapterStates).get(`countries.${country}`);
  countries
    .set('revolution', revolution)
    .write();
  countries.set('hasRevolution', fired)
    .write();
};

module.exports = setRevolution;
