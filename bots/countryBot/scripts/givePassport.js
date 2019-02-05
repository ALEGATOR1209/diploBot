'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const givePassport = ({ chat }, user) => low(adapterStates)
  .get('countries')
  .find(country => country.chat === chat)
  .get('citizens')
  .push(user)
  .write();

module.exports = givePassport;
