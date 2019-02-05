'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const deleteCountry = name => {
  const DBcountries = low(adapterStates);
  let nations = DBcountries.get('countries');
  const i = nations
    .findIndex(country => country.name === name);

  nations = [...nations.value().slice(0, i), ...nations.value().slice(i + 1)];
  DBcountries.set('countries', nations)
    .write();
  return DBcountries.get('countries').value();
};

module.exports = deleteCountry;
