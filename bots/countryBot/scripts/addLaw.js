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
    ctx.reply(text(1), reply);
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(2), reply);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(text(3), reply);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(4), reply);
    return;
  }

  const law = ctx.message.text
    .split('\n')
    .filter(s => s.length > 0);
  if (law.length < 2) {
    ctx.reply(text(8), reply);
    return;
  }
  const lawName = law.shift();
  const lawText = law.join('\n');
  setLaw(country.chat, lawName, {
    text: lawText,
    date: getTurn(),
    WIP: id,
  });
  setState(id, 'addingLaw', 'confirm');
  ctx.reply(
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
    ctx.reply(text(1), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(2), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(text(3), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(4), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    return;
  }

  const messageText = ctx.message.text;
  const lawName = Object.keys(country.laws)
    .find(law => country.laws[law].WIP === id);
  const law = country.laws[lawName];

  if (messageText === text(6)) {
    ctx.reply(text(9), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    law.WIP = undefined;
    setLaw(country.chat, lawName, law);
    return;
  }

  if (messageText === text(7)) {
    ctx.reply(text(10), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    setLaw(country.chat, lawName, null);
    return;
  }

  ctx.reply(text(10), Extra
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
