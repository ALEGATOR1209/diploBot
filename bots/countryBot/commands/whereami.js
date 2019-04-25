'use strict';

const {
  findUser,
  getText,
  getDead,
  getGame,
  getMigrationClass,
} = require('../../imports')
  .few('countryBot', 'scripts',
    [
      'findUser',
      'getText',
      'getDead',
      'getGame',
      'getMigrationClass',
    ]);
const text = t => getText('whereami')[t];
const whereami = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  const link = ctx.message.from.username || ctx.message.from.id;
  const dead = getDead(link);
  if (dead && Object.keys(dead).length > 0) {
    const deathTime = getGame('deathTime');
    const turn = getGame('turn');
    ctx.reply(text(1) + (dead.dateOfDeath + deathTime - turn) + text(2), reply);
    return;
  }
  const country = findUser(link);
  if (!country) {
    ctx.reply(text(4), reply);
    return;
  }

  const messageText = text(3) +
    country.name +
    (country.hasRevolution ? text(11) : text(12)) +
    text(5) +
    Object.keys(country.citizens).length +
    text(6) + country.citizens[link].class + '.' +
    text(7) + (country.citizens[link].inPrison ? text(9) : text(8)) +
    text(10) + getMigrationClass(country.chat);

  ctx.reply(messageText, reply);
};

module.exports = whereami;
