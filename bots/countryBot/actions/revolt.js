'use strict';

const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const {
  findUser,
  getText,
  revoltToString,
  setRevolution,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'revoltToString',
    'setRevolution',
  ]);
const text = t => getText('revolt')[t];

const revolt = ctx => {
  const { id } = ctx.update.callback_query.from;
  const { username: chat } = ctx.update.callback_query.message.chat;
  const country = findUser(id);

  if (!country || country.chat !== chat) {
    ctx.answerCbQuery(text(5));
    return;
  }

  const revolutions = Object.keys(country.revolution);
  const currentRebellionId = revolutions
    .find(rev => country.revolution[rev].active);
  const currentRebellion = country.revolution[currentRebellionId];
  if (!currentRebellion) {
    ctx.answerCbQuery(text(1));
    return;
  }
  ctx.answerCbQuery(text(2));
  if (currentRebellion.rebels.includes(id)) return;
  if (currentRebellion.reactioners.includes(id)) {
    currentRebellion.reactioners = currentRebellion.reactioners
      .filter(reactioner => reactioner !== id);
  }
  currentRebellion.rebels.push(id);
  setRevolution(country.chat, currentRebellionId, currentRebellion, true);

  ctx.editMessageText(
    revoltToString(country, id),
    Extra
      .HTML()
      .markup(Markup.inlineKeyboard([
        Markup.callbackButton(text(3), 'revolt'),
        Markup.callbackButton(text(4), 'reaction')
      ]))
  );
};

module.exports = revolt;
