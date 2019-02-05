'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const checkUserCountry = user => low(adapterStates)
  .get('countries')
  .find(country => country.citizens.includes(user))
  .value();

module.exports = checkUserCountry;
