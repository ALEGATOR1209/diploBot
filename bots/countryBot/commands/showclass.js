'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAllClasses,
  findUser,
  getText,
  setState,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAllClasses',
    'findUser',
    'getText',
    'setState',
  ]);
const text = t => getText('showclass')[t];

const showclass = ctx => {
  const { id, username } = ctx.message.from;
  const tag = username || id;
  const reply = { reply_to_message_id: ctx.message.message_id };

  const userCountry = findUser(tag);
  if (!userCountry) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }
  if (Object.keys(userCountry).length < 1) {
    ctx.reply(text(0) + text(9), reply);
    return;
  }

  const classList = getAllClasses(userCountry.chat);
  ctx.reply(
    text(0) +
    text(11),
    Extra
      .load(reply)
      .markup(Markup.keyboard(Object.keys(classList))
        .oneTime()
        .resize()
        .selective(true)
      )
  );
  setState(id, 'showClass', 1);
};

module.exports = showclass;
