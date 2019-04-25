'use strict';

const {
  getAdmins,
  findUser,
  getRandomChoice,
  bury,
  getText,
  getDead,
  getKillPhrase,
  getGame,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getRandomChoice',
    'bury',
    'getText',
    'getDead',
    'getKillPhrase',
    'getGame',
  ]);
const text = t => getText('kill')[t];

const kill = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  const { username, id } = ctx.message.from;
  const tag = username || id;

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  const country = findUser(tag);

  if (!country) {
    ctx.reply(text(0));
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(6));
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
    ctx.reply(text(5));
    return;
  }
  if (!country.citizens[victim]) {
    ctx.reply(`${text(4)} ${country.name}.`, reply);
    return;
  }
  const killed = parseInt(Math.random() * 100);
  const incognito = parseInt(Math.random() * 100);
  const killerText = incognito > 40 ? text(7) : `@${tag}`;
  const victimText = `@${victim}`;
  const phrase = getRandomChoice(getKillPhrase(killed > 60))
    .replace('{killer}', killerText)
    .replace('{victim}', victimText) + '\n';
  ctx.reply(
    phrase +
    text(8) + killed + text(9) +
    text(8) + incognito + text(10),
    {
      chat_id: `@${country.chat}`,
      parse_mode: 'HTML',
    }
  );
  if (killed > 60) bury(victim);
};

module.exports = kill;
