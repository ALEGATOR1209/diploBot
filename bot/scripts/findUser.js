'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = './databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const findUser = id => low(adapterStates)
  .get('countries')
  .find(country => country.citizens[id])
  .value();

module.exports = findUser;
