'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const deleteCountry = chat => {
  const DBcountries = low(adapterStates);
  DBcountries.unset(`countries.${chat}`)
    .write();
  return DBcountries.get('countries')
    .value();
};

module.exports = deleteCountry;
