'use strict';

const {
  getAdmins,
  getCountry,
  getRandomChoice,
  bury,
  getText,
  getDead,
  getKillPhrase,
  getGame,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getCountry',
    'getRandomChoice',
    'bury',
    'getText',
    'getDead',
    'getKillPhrase',
    'getGame',
  ]);
const text = t => getText('shoot')[t];

const shoot = ctx => {
  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  const reply = { reply_to_message_id: ctx.message.message_id };
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const { username, id } = ctx.message.from;
  const tag = username || id;

  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) {
    ctx.reply(text(8), reply);
    return;
  }

  if (getAdmins().includes(tag)) {
    ctx.reply(text(1), reply);
    return;
  }

  if (!country.citizens[tag]) {
    ctx.reply(text(2));
    return;
  }

  let victim = ctx.message.text
    .slice('/shoot'.length + 1);
  if (!victim) {
    victim = getRandomChoice(Object.keys(country.citizens));
  } else victim = victim.trim().slice(1);
  if (getAdmins().includes(victim)) {
    ctx.reply(text(3), reply);
    return;
  }

  if (getDead(victim)) {
    ctx.reply(text(7));
    return;
  }

  if (!country.citizens[victim]) {
    ctx.reply(text(4), reply);
    return;
  }
  const killed = parseInt(Math.random() * 100);
  const killerText = `@${tag}`;
  const victimText = `@${victim}`;
  const phrase = getRandomChoice(getKillPhrase(killed > 40))
    .replace('{killer}', killerText)
    .replace('{victim}', victimText) + '\n';
  ctx.reply(
    phrase +
    text(5) + killed + text(6),
    { chat_id: `@${country.chat}` }
  );
  if (killed > 40) bury(victim);
};

module.exports = shoot;
