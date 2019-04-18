'use strict';

const {
  getAdmins,
  findUser,
  getRandomChoice,
  bury,
  getText,
  getDead,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getRandomChoice',
    'bury',
    'getText',
    'getDead'
  ]);
const text = t => getText('kill')[t];

const kill = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  const { username, id } = ctx.message.from;
  const tag = username || id;

  const country = findUser(tag);

  if (!country) {
    ctx.reply(text(0));
    return;
  }

  if (getAdmins().includes(tag)) {
    ctx.reply(text(1), reply);
    return;
  }

  let victim = ctx.message.text
    .match(/ .*$/);
  if (!victim) {
    ctx.reply(text(2), reply);
    victim = getRandomChoice(Object.keys(country.citizens));
  } else victim = victim[0].trim().slice(1);
  if (getAdmins().includes(victim)) {
    ctx.reply(text(3), reply);
    return;
  }
  if (getDead(victim)) {
    ctx.reply(text(10));
    return;
  }
  if (!country.citizens[victim]) {
    ctx.reply(`${text(4)} ${country.name}.`, reply);
    return;
  }
  const killed = parseInt(Math.random() * 100);
  const incognito = parseInt(Math.random() * 100);
  ctx.reply(
    `${text(5)} @${victim}!\n` +
    `🎲${killed}  ` + (killed < 60 ? text(6) : text(7)) + '\n' +
    `🎲${incognito}  ` +
    (incognito < 40 ? text(8) : text(9) +
    `${tag ? '@' + tag : ctx.message.from.firs_name}.`),
    { chat_id: `@${country.chat}` }
  ).catch(() => console.log(country.chat, 'not found.'));
  if (killed > 60) bury(victim);
};

module.exports = kill;
