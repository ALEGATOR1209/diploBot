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
const infoText = getText('rmlaw')[0];

const removeLaw = ctx => {
  const { username, id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
  };
  const tag = username || id;
  const country = getCountry(getStates(id).removingLaw);

  const userCountry = findUser(tag);
  if (!country || !userCountry || country.chat !== userCountry.chat) {
    ctx.reply(
      infoText +
      text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingLaw', null);
    return;
  }
  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(
      infoText +
      text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingLaw', null);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(
      infoText +
      text(3),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingLaw', null);
    return;
  }

  const lawlist = country.laws;
  if (!lawlist) {
    ctx.reply(
      infoText +
      text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingLaw', null);
    return;
  }

  const lawName = ctx.message.text;
  if (lawlist.length < 1) {
    ctx.reply(
      infoText +
      text(8),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingLaw', null);
    return;
  }
  if (lawName === getText('rmlaw')[6]) {
    ctx.reply(
      infoText +
      text(7),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingLaw', null);
    return;
  }
  const law = lawlist[lawName];
  if (!law || law.WIP) {
    ctx.reply(
      infoText +
      text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingLaw', null);
    return;
  }

  ctx.reply(
    infoText +
    text(6),
    Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
  );
  setLaw(country.chat, lawName, null);
  setState(id, 'removingLaw', null);
  if (ctx.message.chat.username !== country.chat) {
    ctx.reply(
      text(9),
      { chat_id: `@${country.chat}` }
    );
  }
};

module.exports = removeLaw;
