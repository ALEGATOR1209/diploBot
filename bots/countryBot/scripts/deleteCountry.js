'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const deleteCountry = name => {
  const DBcountries = low(adapterStates);
  let countries = DBcountries.get('countries');
  const index = countries
    .findIndex(country => country.name === name);

  countries = [...countries.value().slice(0, index), ...countries.value().slice(index + 1)];
  DBcountries.set('countries', countries)
    .write();
  return DBcountries.get('countries').value();
};

module.exports = deleteCountry;
