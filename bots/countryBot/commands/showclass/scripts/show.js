'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAllClasses,
  findUser,
  rightsString,
  getText,
  setState,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAllClasses',
    'findUser',
    'rightsString',
    'getText',
    'setState',
  ]);
const text = t => getText('showclass')[t];

const show = ctx => {
  const { text: messageText } = ctx.message;
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };

  const userCountry = findUser(id);
  if (!userCountry) {
    ctx.reply(
      text(0) +
      text(1),
      Extra
        .load(reply)
        .markup(Markup
          .removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'showclass', null);
    return;
  }

  const classList = getAllClasses(userCountry.chat);

  const className = messageText
    .trim();

  if (!className) {
    ctx.reply(
      text(0) +
      text(3),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'showclass', null);
    return;
  }

  const userClass = classList[className];
  if (!userClass || userClass.creator) {
    ctx.reply(
      text(0) +
      text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'showclass', null);
    return;
  }
  const number = Object.keys(userCountry.citizens)
    .filter(man => userCountry.citizens[man].class === className).length;
  ctx.reply(
    text(5) + className + '\n' +
    (userClass.parentClass ? `${text(6)}: ${userClass.parentClass}\n` : '') +
    rightsString(userClass.rights) + text(7) + ': ' +
    (userClass.number ?
      `${userClass.number}\n` : `${text(8)}\n`
    ) +
    `${text(9)}: ${number}` +
    (userClass.number && number >= userClass.number ? text(10) : ''),
    Extra
      .load({
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML',
      })
      .markup(Markup.removeKeyboard(true).selective(true))
  );
  setState(id, 'showclass', null);
};

module.exports = show;
