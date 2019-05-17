'use strict';

const {
  getAdmins,
  findUser,
  getGame,
  getText,
  getPlayers,
  jail,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getGame',
    'getText',
    'getPlayers',
    'jail',
  ]);
const text = t => getText('arrest')[t];

const arrest = ctx => {
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
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(10), reply);
    return;
  }
  const userClass = country.citizens[id].class;
  if (!country.classes[userClass].rights.includes('ARREST_AND_RELEASE')) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }
  if (country.citizens[id].inPrison) {
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
  const players = getPlayers();
  const getNext = () => ctx.bot
    .telegram
    .getChat(players.pop())
    .then(({ id: victimId, username }) => {
      if (username !== victim) {
        if (players.length > 0) return getNext();
        ctx.reply(text(0) + text(5) + country.name, reply);
        return;
      }

      const victimCountry = findUser(victimId);
      if (!victimCountry || victimCountry.chat !== country.chat) {
        ctx.reply(text(0) + text(5) + country.name, reply);
        return;
      }
      if (country.citizens[id].inPrison) {
        ctx.reply(text(8), reply);
        return;
      }

      if (ctx.message.chat.username !== country.chat) {
        ctx.reply(text(0) + text(6).replace('{username}', victim), reply);
      }
      jail(country.chat, victimId, true);
      if (victimId === id) {
        ctx.reply(
          text(12) + `@${victim} ` + text(11),
          { chat_id: `@${country.chat}` }
        );
      } else {
        ctx.reply(
          `@${victim}` + text(7),
          { chat_id: `@${country.chat}` }
        );
      }

    })
    .catch(console.error);
  getNext();
};

module.exports = arrest;
