'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);
const DBcountries = low(adapterStates);

let countries = DBcountries.get('countries').value();
const deleteCountry = name => {
  const index = countries
    .findIndex(country => country.name === name);

  countries = [...countries.slice(0, index), ...countries.slice(index + 1)];
  DBcountries.unset('countries').write();
  DBcountries.set('countries', countries)
    .write();
  return DBcountries.get('countries').value();
};

module.exports = deleteCountry;
