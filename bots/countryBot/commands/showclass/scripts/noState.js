'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAllClasses,
  findUser,
  getText,
  setState,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAllClasses',
    'findUser',
    'getText',
    'setState',
  ]);
const text = t => getText('showclass')[t];

const noState = ctx => {
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };

  const userCountry = findUser(id);
  if (!userCountry) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  const classList = getAllClasses(userCountry.chat);
  ctx.reply(
    text(0) +
    text(2),
    Extra
      .load(reply)
      .markup(Markup.keyboard(Object.keys(classList))
        .oneTime()
        .resize()
        .selective(true)
      )
  );
  setState(id, 'showclass', 'show');
};

module.exports = noState;
