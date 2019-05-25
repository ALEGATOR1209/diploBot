'use strict';

const checkDead = require('./scripts/checkDead');
const checkRevolts = require('./scripts/checkRevolts');
const checkMigrants = require('./scripts/checkMigrants');

const turn = charon => {
  const {
    getAdmins,
    getText,
    getGame,
    setTurn,
  } = charon.get([
    'getAdmins',
    'getText',
    'getGame',
    'setTurn',
  ]);
  const text = t => getText('turn')[t];

  const { id } = charon.message.from;
  if (!getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }
  const turn = getGame('turn');
  setTurn(turn + 1);
  checkDead(charon);
  checkRevolts(charon);
  checkMigrants(charon);
  charon.reply(text(2) + getGame('turn'));
};

module.exports = turn;
