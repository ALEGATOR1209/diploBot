'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAllClasses,
  findUser,
  getCountry,
  rightsString,
  getText,
  setState,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAllClasses',
    'findUser',
    'getCountry',
    'rightsString',
    'getText',
    'setState',
  ]);
const text = t => getText('showclass')[t];

const showClass = ctx => {
  const { text: messageText } = ctx.message;
  const { id, username } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  const userCountry = findUser(tag);
  if (!userCountry) {
    ctx.reply(
      text(0) +
      text(9),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'showClass', null);
    return;
  }

  const classList = getAllClasses(userCountry.chat);

  const className = messageText
    .trim();

  if (!className) {
    ctx.reply(
      text(0) +
      text(10),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'showClass', null);
    return;
  }

  const userClass = classList[className];
  if (!userClass || userClass.creator) {
    ctx.reply(
      text(0) +
      text(3),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'showClass', null);
    return;
  }
  const number = Object.keys(userCountry.citizens)
    .filter(man => userCountry.citizens[man].class === className).length;
  ctx.reply(
    text(4) + className + '\n' +
    (userClass.parentClass ? `${text(5)}: ${userClass.parentClass}\n` : '') +
    rightsString(userClass.rights) + text(6) + ': ' +
    (userClass.number ? `${userClass.number}\n` :
      `${text(7)}\n`) +
    `${text(8)}: ${number}` +
    (userClass.number && number >= userClass.number ? text(12) : ''),
    Extra
      .load({
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML',
      })
      .markup(Markup.removeKeyboard(true).selective(true))
  );
  setState(id, 'showClass', null);
};

module.exports = showClass;
