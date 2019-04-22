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
    ctx.reply(text(1), Markup.removeKeyboard(true).extra());
    setState(id, 'choosingLaw', null);
    return;
  }
  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(text(2), reply);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(3), reply);
    return;
  }

  const lawlist = country.laws;
  if (!lawlist) {
    ctx.reply(text(4), Markup.removeKeyboard(true).extra());
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

  ctx.reply(text(6), Markup.removeKeyboard(true).extra());
  setLaw(country.chat, lawName, null);
  setState(id, 'removingLaw', null);
};

module.exports = removeLaw;
