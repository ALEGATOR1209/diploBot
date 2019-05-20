'use strict';

const {
  getAdmins,
  findUser,
  getText,
  getDead,
  setState,
  getGame,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'setState',
    'getGame',
  ]);
const text = t => getText('sendorders')[t];

const noState = ctx => {
  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(id)) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  if (getDead(id)) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  const country = findUser(id);
  if (!country) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('COMMAND_ARMIES')) {
    ctx.reply(text(0) + text(4), reply);
    return;
  }
  ctx.reply(text(0) + text(5), reply);
  setState(id, 'sendorders', country.chat);
};

module.exports = noState;
