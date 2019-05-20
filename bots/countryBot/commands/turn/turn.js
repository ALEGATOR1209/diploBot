'use strict';

const checkDead = require('./scripts/checkDead');
const checkRevolts = require('./scripts/checkRevolts');
const checkMigrants = require('./scripts/checkMigrants');

const {
  getAdmins,
  getText,
  getGame,
  setTurn,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getText',
    'getGame',
    'setTurn',
  ]);
const text = t => getText('turn')[t];

const turn = ctx => {
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (!getAdmins().includes(id)) {
    ctx.reply(text(1), reply);
    return;
  }
  const turn = getGame('turn');
  setTurn(turn + 1);
  checkDead(ctx);
  checkRevolts(ctx);
  checkMigrants(ctx);
  ctx.reply(text(2) + getGame('turn'));
};

module.exports = turn;
