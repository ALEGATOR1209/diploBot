'use strict';

const getAdmins = require('./getAdmins');
const getCountry = require('./getCountry');
const getRandomChoice = require('./getRandomChoice');
const bury = require('./bury');

const shoot = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const { username, id } = ctx.message.from;
  const tag = username || id;

  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  if (getAdmins().includes(tag)) {
    ctx.reply(
      'Baka! Admins cannot kill players!!!',
      reply
    );
    return;
  }

  if (!country.citizens[tag]) {
    ctx.reply('Вам нельзя тут стрелять.');
    return;
  }

  let victim = ctx.message.text
    .slice('/shoot'.length + 1);
  if (!victim) {
    victim = getRandomChoice(Object.keys(country.citizens));
  }
  else victim = victim.trim().slice(1);
  if (getAdmins().includes(victim)) {
    ctx.reply('Baka! Do not kill admins!', reply);
    return;
  }
  if (!country.citizens[victim]) {
    ctx.reply('Target does not live here.', reply);
    return;
  }
  const killed = parseInt(Math.random() * 100);
  ctx.reply(
    'ВЬІСТРЕЛ!\n\n' +
    `Стреляли в @${victim}!\n` +
    `🎲${killed}  ` + (killed < 60 ? 'Он(а) выживает!' : 'Он(а) погибает!'),
    reply
  );
  if (killed) bury(victim);
};

module.exports = shoot;
