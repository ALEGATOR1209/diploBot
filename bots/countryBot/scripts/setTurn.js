'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterGame = new FileSync('./databases/game.json');

const setTurn = turn => low(adapterGame)
  .set('turn', turn)
  .write();

module.exports = setTurn;
