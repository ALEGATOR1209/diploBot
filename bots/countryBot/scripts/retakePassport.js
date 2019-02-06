'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const retakePassport = ({ chat }, username) => low(adapterStates)
  .get(`countries.${chat}`)
  .unset(`citizens.${user}`)
  .write();

module.exports = retakePassport;
