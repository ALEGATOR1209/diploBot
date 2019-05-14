'use strict';
const {
  getAdmins,
  getText,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getText',
  ]);
const checkDead = require('../turn/scripts/checkDead');
const text = t => getText('dead')[t];

const dead = ctx => {
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (!getAdmins().includes(id)) {
    ctx.reply(text(1), reply);
    return;
  }
  ctx.reply(text(2), reply);
  checkDead(ctx);
};

module.exports = dead;
