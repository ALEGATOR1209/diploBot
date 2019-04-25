'use strict';

const {
  getAdmins,
  findUser,
  getText,
  getDead,
  setState,
  getGame,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'setState',
    'getGame',
  ]);
const text = t => getText('sendorders')[t];

const sendorders = ctx => {
  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;
  if (getAdmins().includes(tag)) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  if (getDead(tag)) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на управление армией')) {
    ctx.reply(text(0) + text(4), reply);
    return;
  }
  ctx.reply(text(0) + text(5), reply);
  setState(id, 'sendingOrders', country.chat);
};

module.exports = sendorders;
