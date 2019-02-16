'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);
const getTurn = require('./getTurn');

const deportUser = (country, user) => {
  const DBcountries = low(adapterStates);
  const state = DBcountries.get(`countries.${country}`);
  state.unset(`citizens.${user}`).write();
  state.get('blacklist').set(user, { banTurn: getTurn() }).write();
};

module.exports = deportUser;
