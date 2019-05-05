'use strict';

const {
  getAdmins,
  setAdminChat,
  getText,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'setAdminChat',
    'getText',
  ]);
const text = t => getText('setadminschat')[t];

const setadminschat = ctx => {
  const { username } = ctx.message.from;

  if (!getAdmins().includes(username)) {
    ctx.reply(text(1));
    return;
  }

  const chat = ctx.message.chat.id;
  setAdminChat(chat);
  ctx.reply(text(2));
};

module.exports = setadminschat;
