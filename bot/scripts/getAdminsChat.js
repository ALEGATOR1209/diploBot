'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterGame = new FileSync('./databases/game.json');

const setAdminChat = () => low(adapterGame)
  .get('adminChat')
  .value();

module.exports = setAdminChat;
