'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const createCountry = (name, chat) => {
  const DBcountries = low(adapterStates);
  const countries = DBcountries.get('countries');
  countries.push({ name, chat, citizens: [] })
    .write();
  return countries.value();
};

module.exports = createCountry;
