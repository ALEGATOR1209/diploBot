'use strict';

const {
  getAdmins,
  findUser,
  getGame,
  getText,
  jail,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getGame',
    'getText',
    'jail',
  ]);
const text = t => getText('arrest')[t];

const arrest = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(tag)) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(10), reply);
    return;
  }
  const userClass = country.citizens[tag].class;
  if (!country.classes[userClass].rights.includes('Право на арест')) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(0) + text(9), reply);
    return;
  }

  let victim = ctx.message.text
    .match(/ @.*/gi);
  if (!victim) {
    ctx.reply(text(0) + text(4), reply);
    return;
  }
  victim = victim[0]
    .trim()
    .slice(1);
  const victimCountry = findUser(victim);
  if (!victimCountry || victimCountry.chat !== country.chat) {
    ctx.reply(text(0) + text(5) + country.name, reply);
    return;
  }
  if (country.citizens[victim].inPrison) {
    ctx.reply(text(8), reply);
    return;
  }

  if (ctx.message.chat.username !== country.chat) {
    ctx.reply(text(0) + text(6), reply);
  }
  jail(country.chat, victim, true);
  if (victim === tag) {
    ctx.reply(
      text(12) + `@${tag} ` + text(11),
      { chat_id: `@${country.chat}` }
    );
  } else {
    ctx.reply(
      `@${victim}` + text(7),
      { chat_id: `@${country.chat}` }
    );
  }
};

module.exports = arrest;