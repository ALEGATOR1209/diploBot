'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const givePassport = ({ chat }, user) => low(adapterStates)
  .get(`countries.${chat}`)
  .set(`citizens.${user}`, 
    { 
      class: 'default',
      inPrison: false,
    }
  ).write();

module.exports = givePassport;