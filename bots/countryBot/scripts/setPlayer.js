'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterPlayers = new FileSync('./databases/players.json');

const setPlayer = (id, remove = false) => {
  const db = low(adapterPlayers);
  let players = db.get('players').value();

  if (remove) {
    const i = players.findIndex(id);
    players = [...players.slice(0, i), ...players.slice(i + 1)];
  } else players.push(id);

  db
    .set('players', players)
    .write();
};

module.exports = setPlayer;
