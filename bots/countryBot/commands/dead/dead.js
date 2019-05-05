'use strict';
const {
  getAdmins,
  checkDead,
  getText,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'checkDead',
    'getText',
  ]);
const text = t => getText('dead')[t];


const dead = ctx => {
  const { username } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (!getAdmins().includes(username)) {
    ctx.reply(text(1), reply);
    return;
  }
  ctx.reply(text(2), reply);
  checkDead(ctx);
};

module.exports = dead;
