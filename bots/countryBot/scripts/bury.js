'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const findUser = require('./findUser');
const getTurn = require('./getTurn');

const adapterStates = new FileSync('./databases/countries.json');
const adapterGraveyard = new FileSync('./databases/graveyard.json');

const bury = user => {
  const DBcountries = low(adapterStates);
  const DBgraveyard = low(adapterGraveyard);
  const country = findUser(user);

  DBcountries
    .unset(`countries.${country.chat}.citizens.${user}`)
    .write();
  const dateOfDeath = getTurn();
  console.log(dateOfDeath);
  DBgraveyard
    .set(user, { dateOfDeath })
    .write();
};

module.exports = bury;
