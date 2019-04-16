'use strict';

const {
  getAdmins,
  findUser,
  retakePassport,
  getText,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'retakePassport',
    'getText',
  ]);
const text = t => getText('addclass')[t];

const droppassport = ctx => {
  const { username, id } = ctx.message.from;
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(text(1), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  const userCountry = findUser(username) || findUser(id);
  if (!userCountry) {
    ctx.reply(text(2), { reply_to_message_id: ctx.message.message_id });
    return;
  }
  if (username) retakePassport(userCountry, username);
  else retakePassport(userCountry, id);
  ctx.reply(text(3), { reply_to_message_id: ctx.message.message_id });
};

module.exports = droppassport;
