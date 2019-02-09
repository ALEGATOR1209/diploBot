'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterGame = new FileSync(`${databases}/game.json`);

const getTurn = () => low(adapterGame)
  .get('turn')
  .value();

module.exports = getTurn;
