'use strict';

const getAdmins = require('./getAdmins');
const findUser = require('./findUser');
const getRandomChoice = require('./getRandomChoice');
const bury = require('./bury');

const kill = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  const { username, id } = ctx.message.from;
  const tag = username || id;

  const country = findUser(tag);

  if (getAdmins().includes(tag)) {
    ctx.reply(
      'Админам нельзя убивать игроков!',
      reply
    );
    return;
  }

  let victim = ctx.message.text
    .match(/ .*$/);
  if (!victim) {
    ctx.reply('Убиваем случайного игрока.', reply);
    victim = getRandomChoice(Object.keys(country.citizens));
  } else victim = victim[0].trim().slice(1);
  if (getAdmins().includes(victim)) {
    ctx.reply('Baka! Do not kill admins!', reply);
    return;
  }
  if (!country.citizens[victim]) {
    ctx.reply(`Target does not live in ${country.name}.`, reply);
    return;
  }
  const killed = parseInt(Math.random() * 100);
  const incognito = parseInt(Math.random() * 100);
  ctx.reply(
    `Стреляли в @${victim}!\n` +
    `🎲${killed}  ` + (killed < 60 ? 'Он(а) выживает!' : 'Он(а) погибает!') + '\n' +
    `🎲${incognito}  ` + (incognito < 40 ? 'Убийца скрылся.' : `Стрелял ${tag ? '@' + tag : ctx.message.from.firs_name}.`),
    { chat_id: `@${country.chat}` }
  ).catch(() => console.log(country.chat, 'not found.'));
  if (killed) bury(victim);
};

module.exports = kill;
