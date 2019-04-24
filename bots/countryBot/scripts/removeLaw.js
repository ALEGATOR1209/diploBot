'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  setState,
  getStates,
  getText,
  getCountry,
  findUser,
  setLaw,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'getStates',
    'getText',
    'getCountry',
    'findUser',
    'setLaw',
  ]);
const text = t => getText('removeLaw')[t];

const removeLaw = ctx => {
  const { username, id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'Markdown',
  };
  const tag = username || id;
  const country = getCountry(getStates(id).removingLaw);

  const userCountry = findUser(tag);
  if (!country || !userCountry || country.chat !== userCountry.chat) {
    ctx.reply(
      text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).extra())
    );
    setState(id, 'choosingLaw', null);
    return;
  }
  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(
      text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).extra())
    );
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(
      text(3),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).extra())
    );
    return;
  }

  const lawlist = country.laws;
  if (!lawlist) {
    ctx.reply(
      text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).extra())
    );
    setState(id, 'choosingLaw', null);
    return;
  }

  const lawName = ctx.message.text;
  if (lawlist.length < 1) {
    ctx.reply(
      text(8),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).extra())
    );
    setState(id, 'choosingLaw', null);
    return;
  }
  if (lawName === getText('rmlaw')[6]) {
    ctx.reply(
      text(7),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).extra())
    );
    setState(id, 'choosingLaw', null);
    return;
  }
  const law = lawlist[lawName];
  if (!law || law.WIP) {
    ctx.reply(
      text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).extra())
    );
    setState(id, 'choosingLaw', null);
    return;
  }

  ctx.reply(
    text(6),
    Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).extra())
  );
  setLaw(country.chat, lawName, null);
  setState(id, 'removingLaw', null);
};

module.exports = removeLaw;
