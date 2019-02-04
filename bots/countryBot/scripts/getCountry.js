'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);
const DBcountries = low(adapterStates);
DBcountries.defaults({
  countries: [],
}).write();

const getCountry = name => DBcountries.get('countries')
  .find(country => country.name === name)
  .value();

module.exports = getCountry;
