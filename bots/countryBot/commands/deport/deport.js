'use strict';

const {
  findUser,
  getText,
  getChildClasses,
  deportUser,
  getGame,
  getPlayers,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getChildClasses',
    'deportUser',
    'getGame',
    'getPlayers',
  ]);
const text = t => getText('deport')[t];

const deport = ctx => {
  const { id } = ctx.message.from;
  const country = findUser(id);
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'), reply);
    return;
  }

  if (!country) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(10), reply);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];

  if (country.citizens[id].inPrison) {
    ctx.reply(text(0) + text(7), reply);
    return;
  }
  if (!userClass.rights.includes('BORDER_MANAGEMENT')) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }

  let target = ctx.message.text
    .match(/ .*$/g);
  if (!target) {
    ctx.reply(text(0) + text(3));
    return;
  }

  target = target[0].trim();
  if (target[0] === '@') target = target.slice(1);

  const players = getPlayers();
  const getNext = () => ctx.bot
    .telegram
    .getChat(players.pop())
    .then(({ id: targetId, username }) => {
      if (username !== target) {
        if (players.length > 0) return getNext();
        ctx.reply(text(0) + text(4), reply);
        return;
      }

      const targetCountry = findUser(targetId);
      if (!targetCountry || targetCountry.chat !== country.chat) {
        ctx.reply(text(0) + text(4));
        return;
      }
      const targetClass = country.citizens[targetId].class;
      const childClasses = getChildClasses(
        targetClass, Object.keys(country.classes)
      );
      if (childClasses.includes(userClassName)) {
        ctx.reply(text(0) + text(5));
        return;
      }

      if (country.citizens[targetId].inPrison) {
        ctx.reply(text(0) + text(9));
        return;
      }

      deportUser(country.chat, targetId);
      ctx.reply(`${text(0)}${text(8)} @${target} ${text(6)} ${country.name}`);
      if (ctx.message.chat.username !== country.chat) {
        ctx.reply(
          `${text(8)} @${target} ${text(6)} ${country.name}`,
          { chat_id: `@${country.chat}` }
        );
      }
    })
    .catch(console.error);
  getNext();
};

module.exports = deport;
