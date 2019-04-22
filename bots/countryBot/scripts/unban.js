'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const unban = (country, users) => {
  const DBcountries = low(adapterStates);
  const state = DBcountries.get(`countries.${country}`);
  for (const user of users) {
    state
      .unset(`blacklist.${user}`)
      .write();
  }
};

module.exports = unban;
