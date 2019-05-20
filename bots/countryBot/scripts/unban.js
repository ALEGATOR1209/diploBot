'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const unban = (country, user) => {
  const DBcountries = low(adapterStates);
  const state = DBcountries.get(`countries.${country}`);
  state
    .unset(`blacklist.${user}`)
    .write();
};

module.exports = unban;
