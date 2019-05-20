'use strict';

const {
  rightsString,
  getText,
  findUser,
  getDead,
  getPlayers,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'rightsString',
    'getText',
    'findUser',
    'getDead',
    'getPlayers',
  ]);
const text = t => getText('rights')[t];

const rights = ctx => {
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };

  let tag = ctx.message
    .text
    .match(/@[^@]*$/gi);
  if (tag) tag = tag[0]
    .trim()
    .slice(1);
  else tag = ctx.message.from.username;
  if (tag === 'dipl_countryBot') {
    ctx.reply(
      text(1).replace('{user}', `@${tag}`) + text(11),
      reply
    );
    return;
  }

  const players = getPlayers();
  const getNext = () => ctx.bot
    .telegram
    .getChat(players.pop())
    .then(({ id, username }) => {
      if (username !== tag) {
        if (players.length) return getNext();
        return ctx.reply(text(12));
      }
      if (getDead(id)) {
        ctx.reply(
          text(8),
          reply
        );
        return;
      }

      const country = findUser(id);
      if (!country) {
        ctx.reply(
          text(9).replace('{user}', `@${tag}`),
          reply
        );
        return;
      }

      const user = country.citizens[id];
      if (!user) {
        ctx.reply(
          `${text(3)} ${country.name}.`,
          reply
        );
        return;
      }

      const userClassName = country.citizens[id].class;
      const userClass = country.classes[user.class];
      ctx.reply(
        text(1).replace('{user}', `@${tag}`) +
        rightsString(userClass.rights) + '\n' +
        (user.inPrison ? text(4) : text(5)) +
        text(6) + userClassName + text(7) + country.name +
        (tag === ctx.message.from.username ? text(10) : ''),
        reply
      );
    })
    .catch(console.error);
  getNext();
};

module.exports = rights;
