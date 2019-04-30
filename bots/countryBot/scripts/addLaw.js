'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  findUser,
  getText,
  setState,
  getStates,
  getTurn,
  setLaw,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'setState',
    'getStates',
    'getTurn',
    'setLaw',
  ]);
const text = t => getText('addlaw')[t];

const enteringLaw = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(tag)) {
    ctx.reply(text(0) + text(1), reply);
    setState(id, 'addingLaw', null);
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    setState(id, 'addingLaw', null);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(12), reply);
    setState(id, 'addingLaw', null);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(text(0) + text(3), reply);
    setState(id, 'addingLaw', null);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(0) + text(4), reply);
    setState(id, 'addingLaw', null);
    return;
  }

  const law = ctx.message.text
    .split('\n')
    .filter(s => s.length > 0);
  if (law.length < 2) {
    ctx.reply(text(0) + text(8), reply);
    setState(id, 'addingLaw', null);
    return;
  }
  const lawName = law.shift();
  if (lawName.match(/\./gi)) {
    ctx.reply(text(0) + text(13), reply);
    return;
  }
  const lawText = law.join('\n');
  setLaw(country.chat, lawName, {
    text: lawText,
    date: getTurn(),
    WIP: id,
  });
  setState(id, 'addingLaw', 'confirm');
  ctx.reply(
    text(0) +
    text(11),
    Extra
      .load(reply)
      .markup(
        Markup.keyboard([text(6), text(7)])
          .oneTime()
          .resize()
          .selective(true)
      )
  );
};

const confirm = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(tag)) {
    ctx.reply(text(0) + text(1), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(0) + text(2), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(12), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(text(0) + text(3), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(0) + text(4), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    return;
  }

  const messageText = ctx.message.text;
  const lawName = Object.keys(country.laws)
    .find(law => country.laws[law].WIP === id);
  const law = country.laws[lawName];

  if (messageText === text(6)) {
    ctx.reply(text(0) + text(9), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    law.WIP = undefined;
    setLaw(country.chat, lawName, law);
    return;
  }

  if (messageText === text(7)) {
    ctx.reply(text(0) + text(10), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    setLaw(country.chat, lawName, null);
    return;
  }

  ctx.reply(text(0) + text(10), Extra
    .load(reply)
    .markup(Markup.removeKeyboard(true).oneTime().resize().selective(true))
  );
};

const lawHandlers = {
  enteringLaw,
  confirm,
};

const addlaw = ctx => {
  const state = getStates(ctx.message.from.id);
  if (state.addingLaw)
    lawHandlers[state.addingLaw](ctx);
};

module.exports = addlaw;
