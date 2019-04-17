'use strict';

const {
  findUser,
  getText,
  getDead,
  getGame,
} = require('../../imports')
  .few('countryBot', 'scripts',
    [
      'findUser',
      'getText',
      'getDead',
      'getGame',
    ]);
const text = t => getText('whereami')[t];
const whereami = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  const link = ctx.message.from.username || ctx.message.from.id;
  const dead = getDead(link);
  if (dead) {
    const deathTime = getGame('deathTime');
    const turn = getGame('turn');
    ctx.reply(text(1) + (dead.dateOfDeath + deathTime - turn) + text(2), reply);
    return;
  }
  const country = findUser(link);
  if (country) {
    ctx.reply(text(3) + country.name + ` @${country.chat}`, reply);
  } else ctx.reply(text(4), reply);
};

module.exports = whereami;
