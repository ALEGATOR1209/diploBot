'use strict';

const {
  findUser,
  getText,
  getPlayers,
  unban,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getPlayers',
    'unban',
  ]);
const text = t => getText('opendoors')[t];

const opendoors = ctx => {
  const { id } = ctx.message.from;
  const country = findUser(id);
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (!country) {
    ctx.reply(
      text(0) +
      text(1),
      reply
    );
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      text(0) +
      text(10),
      reply
    );
    return;
  }
  const userClass = country.classes[
    country
      .citizens[id]
      .class
  ];
  if (!userClass.rights.includes('BORDER_MANAGEMENT')) {
    ctx.reply(
      text(0) +
      text(2),
      reply
    );
    return;
  }

  const blacklist = country.blacklist;
  if (Object.keys(blacklist).length < 1) {
    ctx.reply(
      text(0) +
      text(3),
      reply
    );
    return;
  }

  let targetTag = ctx
    .message
    .text
    .match(/@.*/gi);
  if (!targetTag) {
    ctx.reply(text(0) + text(7));
    return;
  }
  targetTag = targetTag[0].trim();
  if (targetTag.match(/^@/)) targetTag = targetTag.slice(1);

  const players = getPlayers();
  let targetFound = false;
  players.forEach(player => ctx.bot
    .telegram
    .getChat(player)
    .then(user => {
      if (user.username === targetTag) {
        targetFound = true;
        if (blacklist[user.id] === undefined) {
          ctx.reply(text(0) + text(12), reply);
          return;
        }
        ctx.reply(text(0) + text(8), reply);
        if (country.chat !== ctx.message.chat.username)
          ctx.reply(
            text(0) + text(13)
              .replace('{player}', `@${targetTag}`),
            { chat_id: `@${country.chat}` }
          );
        unban(country.chat, user.id);
      }
    })
    .finally(() => {
      if (!targetFound) {
        ctx.reply(text(0) + text(11), reply);
        return;
      } else players.length = 0;
    })
    .catch(e => console.error(e))
  );
};

module.exports = opendoors;
