'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);
const DBcountries = low(adapterStates);
DBcountries.defaults({
  countries: [],
}).write();

const countries = DBcountries.get('countries');
const createCountry = (name, chat) => {
  countries.push({ name, chat })
    .write();
  return countries.value();
};

module.exports = createCountry;
