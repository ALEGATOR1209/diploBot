'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getStates,
  setState,
  getText,
  findUser,
  removeClass,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getStates',
    'setState',
    'getText',
    'findUser',
    'removeClass',
  ]);
const text = t => getText('panic')[t];

const panic = ctx => {
  const { username, id } = ctx.message.from;
  const states = getStates(id);
  for (const state in states) {
    setState(id, state, null);
  }
  const country = findUser(username);

  //Cleaning unfinished classes
  if (country) {
    Object.keys(country.classes)
      .filter(cl => country.classes[cl].creator === id)
      .forEach(cl => removeClass(country.chat, cl));
  }

  ctx.reply(
    text(1),
    Extra
      .load({ reply_to_message_id: ctx.message.message_id })
      .markup(Markup.removeKeyboard(true).selective(true))
  );
};

module.exports = panic;
