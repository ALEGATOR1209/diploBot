'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterPlayers = new FileSync('./databases/players.json');

const getPlayers = () => low(adapterPlayers).get('players').value();

module.exports = getPlayers;
