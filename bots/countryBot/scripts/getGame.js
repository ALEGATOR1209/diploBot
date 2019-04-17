'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterGame = new FileSync('./databases/game.json');

const getGame = id => low(adapterGame)
  .get(id)
  .value();

module.exports = getGame;
