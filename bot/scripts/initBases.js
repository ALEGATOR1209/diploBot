'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const initDataBases = () => {
  low(new FileSync('./databases/graveyard.json'))
    .defaults({ cemetery: {} })
    .write();

  low(new FileSync('./databases/countries.json'))
    .defaults({ countries: {} })
    .write();

  low(new FileSync('./databases/states.json'))
    .defaults({})
    .write();

  low(new FileSync('./databases/players.json'))
    .defaults({ players: [] })
    .write();

  low(new FileSync('./databases/game.json'))
    .defaults({
      'turn': 0,
      'deathTime': 5,
      'gameChannel': '@ceppelinBE',
      'shootTimeout': 43200000,
    })
    .write();
};

module.exports = initDataBases;
