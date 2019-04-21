'use strict';

const {
  getAdmins,
  findUser,
  getText,
  jail,
  getExecution,
  getRandomChoice,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'jail',
    'getExecution',
    'getRandomChoice',
  ]);
const text = t => getText('execute')[t];

const arrest = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (getAdmins().includes(tag)) {
    ctx.reply(text(1), reply);
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(2), reply);
    return;
  }
  const userClass = country.citizens[tag].class;
  if (!country.classes[userClass].rights.includes('Право на казнь')) {
    ctx.reply(text(3), reply);
    return;
  }

  let victim = ctx.message.text
    .match(/ @[A-z]*/gi);
  if (!victim) {
    ctx.reply(text(4), reply);
    return;
  }
  victim = victim[0]
    .trim()
    .slice(1);
  const victimCountry = findUser(victim);
  if (!victimCountry || victimCountry.chat !== country.chat) {
    ctx.reply(text(5) + country.name, reply);
    return;
  }
  if (!country.citizens[victim].inPrison) {
    ctx.reply(text(6), reply);
    return;
  }

  ctx.reply(text(7), reply);
  jail(country.chat, victim, true);
  ctx.reply(
    `@${victim}` + getRandomChoice(getExecution()),
    { chat_id: `@${country.chat}` }
  );
};

module.exports = arrest;
