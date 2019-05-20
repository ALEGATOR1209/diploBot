'use strict';

const {
  getAdmins,
  findUser,
  getText,
  bury,
  getGame,
  getPlayers,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'bury',
    'getGame',
    'getPlayers'
  ]);
const text = t => getText('execute')[t];

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
    ctx.reply(text(0) + text(8), reply);
    return;
  }

  const userClass = country.citizens[id].class;
  if (!country.classes[userClass].rights.includes('EXECUTION')) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }
  if (country.citizens[id].inPrison) {
    ctx.reply(text(0) + text(10), reply);
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
        ctx.reply(text(0) + text(6), reply);
        return;
      }

      ctx.reply(text(0) + text(7), reply);
      bury(targetId);
      if (ctx.message.chat.username !== country.chat)
        ctx.reply(
          `@${victim}` + text('executions'),
          { chat_id: `@${country.chat}` }
        );
    })
    .catch(console.error)
    .finally(() => {
      if (targetFound) {
        players.length = 0;
        return;
      }
      if (i === players.length - 1 && !targetFound) {
        ctx.reply(text(0) + text(9), reply);
      }
    })
  );
};

module.exports = arrest;
