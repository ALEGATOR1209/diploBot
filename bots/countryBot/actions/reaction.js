'use strict';

const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const {
  findUser,
  getText,
  declareRevolutionaryDemands,
  setRevolution,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'declareRevolutionaryDemands',
    'setRevolution',
  ]);
const text = t => getText('reaction')[t];

const reaction = ctx => {
  const { username, id } = ctx.update.callback_query.from;
  const { username: chat } = ctx.update.callback_query.message.chat;
  const tag = username || id;
  const country = findUser(tag);

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
  if (currentRebellion.reactioners.includes(tag)) return;
  if (currentRebellion.rebels.includes(tag)) {
    currentRebellion.rebels = currentRebellion.rebels
      .filter(rebel => rebel !== tag);
  }
  currentRebellion.reactioners.push(tag);
  setRevolution(country.chat, currentRebellionId, currentRebellion, true);

  ctx.editMessageText(
    declareRevolutionaryDemands(country, id, tag),
    Extra.HTML().markup(Markup.inlineKeyboard([
      Markup.callbackButton(text(3), 'revolt'),
      Markup.callbackButton(text(4), 'reaction')
    ]))
  );
};

module.exports = reaction;
