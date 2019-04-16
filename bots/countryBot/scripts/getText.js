'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterLocalization = new FileSync('./databases/localization.json');

const getText = id => low(adapterLocalization)
  .get(id)
  .value();

module.exports = getText;
