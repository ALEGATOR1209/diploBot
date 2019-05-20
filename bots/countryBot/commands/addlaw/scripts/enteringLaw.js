'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  findUser,
  getText,
  setState,
  getTurn,
  setLaw,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'setState',
    'getTurn',
    'setLaw',
  ]);
const text = t => getText('addlaw')[t];

const enteringLaw = ctx => {
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(id)) {
    ctx.reply(text(0) + text(1), reply);
    setState(id, 'addlaw', null);
    return;
  }

  const country = findUser(id);
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    setState(id, 'addlaw', null);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(12), reply);
    setState(id, 'addlaw', null);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('ADOPTING_LAWS')) {
    ctx.reply(text(0) + text(3), reply);
    setState(id, 'addlaw', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    ctx.reply(text(0) + text(4), reply);
    setState(id, 'addlaw', null);
    return;
  }

  const law = ctx.message.text
    .split('\n')
    .filter(s => s.length > 0);
  if (law.length < 2) {
    ctx.reply(text(0) + text(8), reply);
    setState(id, 'addlaw', null);
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
  setState(id, 'addlaw', 'confirmation');
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

module.exports = enteringLaw;
