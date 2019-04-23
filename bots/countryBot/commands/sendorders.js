'use strict';

const {
  getAdmins,
  findUser,
  getText,
  getDead,
  setState,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'setState',
  ]);
const text = t => getText('sendorders')[t];

const sendorders = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;
  if (getAdmins().includes(tag)) {
    ctx.reply(text(1), reply);
    return;
  }

  if (getDead(tag)) {
    ctx.reply(text(2), reply);
    return;
  }
  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(3), reply);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на управление армией')) {
    ctx.reply(text(4), reply);
    return;
  }
  ctx.reply(text(5), reply);
  setState(id, 'sendingOrders', country.chat);
};

module.exports = sendorders;
