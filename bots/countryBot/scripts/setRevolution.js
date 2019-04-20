'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const setRevolution = (country, id, revolution = null, fired = false) => {
  const countries = low(adapterStates).get(`countries.${country}`);
  if (revolution === null) {
    countries
      .unset(`revolution.${id}`)
      .write();
    return;
  }
  countries
    .set('revolution', { [id]: revolution })
    .write();
  countries.set('hasRevolution', fired)
    .write();
};

module.exports = setRevolution;
