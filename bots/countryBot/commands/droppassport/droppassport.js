'use strict';

const {
  getAdmins,
  findUser,
  setEmigrantQueue,
  getText,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'setEmigrantQueue',
    'getText',
  ]);
const text = t => getText('droppassport')[t];

const droppassport = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  const { id } = ctx.message.from;
  if (getAdmins().includes(id)) {
    ctx.reply(text(1), reply);
    return;
  }

  const country = findUser(id);
  if (!country) {
    ctx.reply(text(2), reply);
    return;
  }
  if (country.citizens[id].inPrison) {
    ctx.reply(text(4), reply);
    return;
  }

  const queue = country.emigrantQueue;
  setEmigrantQueue(country.chat, [...queue, id]);
  ctx.reply(text(3), { reply_to_message_id: ctx.message.message_id });
};

module.exports = droppassport;
