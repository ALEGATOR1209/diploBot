'use strict';

const {
  getAdmins,
  getText,
  getGame,
  setTurn,
  checkDead,
  checkRevolts,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getText',
    'getGame',
    'setTurn',
    'checkDead',
    'checkRevolts',
  ]);
const text = t => getText('turn')[t];

const turn = ctx => {
  const { username } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (!getAdmins().includes(username)) {
    ctx.reply(text(1), reply);
    return;
  }
  const turn = getGame('turn');
  setTurn(turn + 1);
  checkDead(ctx);
  checkRevolts(ctx);
  ctx.reply(text(2) + getGame('turn'));
};

module.exports = turn;
