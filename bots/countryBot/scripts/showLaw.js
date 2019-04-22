'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  setState,
  getStates,
  getText,
  getCountry,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'getStates',
    'getText',
    'getCountry',
  ]);
const text = t => getText('showLaw')[t];

const laws = ctx => {
  const { id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'Markdown',
  };
  const country = getCountry(getStates(id).choosingLaw);

  if (ctx.message.text === text(7)) {
    ctx.reply(text(8), Markup.removeKeyboard(true).extra());
    setState(id, 'choosingLaw', null);
    return;
  }
  if (!country) {
    ctx.reply(text(1), Markup.removeKeyboard(true).extra());
    setState(id, 'choosingLaw', null);
    return;
  }

  const lawlist = country.laws;
  if (!lawlist) {
    ctx.reply(text(2), Markup.removeKeyboard(true).extra());
    setState(id, 'choosingLaw', null);
    return;
  }
  const lawName = ctx.message.text;
  const law = lawlist[lawName];
  if (!law || law.WIP) {
    ctx.reply(text(3), Markup.removeKeyboard(true).extra());
    setState(id, 'choosingLaw', null);
    return;
  }

  const answer =
    text(4) + lawName.toUpperCase() + text(4) +
    text(5) + law.date + text(6) +
    law.text;

  ctx.reply(
    answer,
    Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true))
  );
  setState(id, 'choosingLaw', null);
};

module.exports = laws;