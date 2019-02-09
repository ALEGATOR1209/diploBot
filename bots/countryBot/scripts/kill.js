'use strict';

const getAdmins = require('./getAdmins');
const findUser = require('./findUser');
const getRandomChoice = require('./getRandomChoice');
const bury = require('./bury');
const getText = id => require('./getText')(`kill.${id}`);
const getDead =require('./getDead');

const kill = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  const { username, id } = ctx.message.from;
  const tag = username || id;

  const country = findUser(tag);

  if (!country) {
    ctx.reply(getText(0));
    return;
  }

  if (getAdmins().includes(tag)) {
    ctx.reply(getText(1), reply);
    return;
  }

  let victim = ctx.message.text
    .match(/ .*$/);
  if (!victim) {
    ctx.reply(getText(2), reply);
    victim = getRandomChoice(Object.keys(country.citizens));
  } else victim = victim[0].trim().slice(1);
  if (getAdmins().includes(victim)) {
    ctx.reply(getText(3), reply);
    return;
  }
  if (getDead(victim)) {
    ctx.reply(getText(10));
    return;
  }
  if (!country.citizens[victim]) {
    ctx.reply(`${getText(4)} ${country.name}.`, reply);
    return;
  }
  const killed = parseInt(Math.random() * 100);
  const incognito = parseInt(Math.random() * 100);
  ctx.reply(
    `${getText(5)} @${victim}!\n` +
    `🎲${killed}  ` + (killed < 60 ? getText(6) : getText(7)) + '\n' +
    `🎲${incognito}  ` + (incognito < 40 ? getText(8) : `${getText(9)} ${tag ? '@' + tag : ctx.message.from.firs_name}.`),
    { chat_id: `@${country.chat}` }
  ).catch(() => console.log(country.chat, 'not found.'));
  if (killed) bury(victim);
};

module.exports = kill;
