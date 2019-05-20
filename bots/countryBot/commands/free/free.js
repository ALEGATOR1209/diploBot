'use strict';

const {
  getAdmins,
  findUser,
  getText,
  jail,
  getGame,
  getPlayers,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'jail',
    'getGame',
    'getPlayers',
  ]);
const text = t => getText('free')[t];

const free = ctx => {
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(id)) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  const country = findUser(id);
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }

  const userClass = country.citizens[id].class;
  if (!country.classes[userClass].rights.includes('ARREST_AND_RELEASE')) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }

  if (country.hasRevolution) {
    ctx.reply(text(0) + text(9), reply);
    const prisoners = Object.keys(country.citizens)
      .filter(man => country.citizens[man].inPrison);
    prisoners.forEach(id => Math.random() > 0.6 || ctx.bot
      .telegram
      .getChat(id)
      .then(({ username }) => ctx.reply(
        text(12) + text(13).replace('{user}', `@${username}`),
        { chat_id: `@${country.chat}` }
      ))
      .catch(console.error)
    );
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
  const players = getPlayers();
  let targetFound = false;
  players.forEach((pid, i) => ctx.bot
    .telegram
    .getChat(pid)
    .then(({ id: targetId, username }) => {
      if (username !== victim) return;
      targetFound = true;
      const victimCountry = findUser(targetId);
      if (!victimCountry || victimCountry.chat !== country.chat) {
        ctx.reply(text(0) + text(5) + country.name, reply);
        return;
      }
      if (!country.citizens[targetId].inPrison) {
        ctx.reply(text(0) + text(8), reply);
        return;
      }

      if (ctx.message.chat.username !== country.chat)
        ctx.reply(text(0) + text(6), reply);
      jail(country.chat, targetId, false);
      if (targetId === id) {
        ctx.reply(
          text(10) + username + text(11),
          { chat_id: `@${country.chat}` }
        );
      } else {
        ctx.reply(
          `@${username}` + text(7),
          { chat_id: `@${country.chat}` }
        );
      }
    })
    .catch(console.error)
    .finally(() => {
      if (targetFound) {
        players.length = 0;
        return;
      }
      if (i === players.length - 1 && !targetFound) {
        ctx.reply(text(0) + text(14), reply);
      }
    })
  );
};

module.exports = free;
