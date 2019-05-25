'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const givePassport = ({ chat }, user) => low(adapterStates)
  .set(`countries.${chat}.citizens.${user}`, {
    'class': low(adapterStates).get(`countries.${chat}.migrantClass`).value(),
    inPrison: false,
  }).write();

module.exports = givePassport;
