'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterGame = new FileSync('./databases/game.json');

const setAdminChat = chat => low(adapterGame)
  .set('adminChat', chat)
  .write();

module.exports = setAdminChat;
