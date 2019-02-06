'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const getCountry = id => {
  const DBcountries = low(adapterStates);
  DBcountries.defaults({
    countries: {},
  }).write();

  return DBcountries.get(`countries.${id}`)
    .value();
};

module.exports = getCountry;
