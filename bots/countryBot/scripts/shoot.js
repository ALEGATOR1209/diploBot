'use strict';

const getAdmins = require('./getAdmins');
const getCountry = require('./getCountry');
const getRandomChoice = require('./getRandomChoice');
const bury = require('./bury');
const getText = id => require('./getText')(`shoot.${id}`);

const shoot = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const { username, id } = ctx.message.from;
  const tag = username || id;

  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  if (getAdmins().includes(tag)) {
    ctx.reply(getText(1), reply);
    return;
  }

  if (!country.citizens[tag]) {
    ctx.reply(getText(2));
    return;
  }

  let victim = ctx.message.text
    .slice('/shoot'.length + 1);
  if (!victim) {
    victim = getRandomChoice(Object.keys(country.citizens));
  } else victim = victim.trim().slice(1);
  if (getAdmins().includes(victim)) {
    ctx.reply(getText(3), reply);
    return;
  }
  if (!country.citizens[victim]) {
    ctx.reply(getText(4), reply);
    return;
  }
  const killed = parseInt(Math.random() * 100);
  ctx.reply(
    `${getText(5)} @${victim}!\n` +
    `🎲${killed}  ` + (killed < 60 ? getText(6) : getText(7)),
    reply
  );
  if (killed) bury(victim);
};

module.exports = shoot;