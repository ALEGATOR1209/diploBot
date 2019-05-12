'use strict';

const {
  getAdmins,
  getText
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getText',
  ]);
const text = t => getText('sendmessage')[t];

const sendmessage = ctx => {
  const { id } = ctx.message.from;
  if (!getAdmins().includes(id)) {
    ctx.reply(text(1));
    return;
  }
  const chat = ctx.message.text
    .match(/ @[^(\n)]*/g);
  const messageText = ctx.message.text
    .match(/\n.*/g);
  if (!chat) {
    ctx.reply(text(2));
    ctx.reply(text(3));
    return;
  }
  if (!messageText) {
    ctx.reply(text(4));
    ctx.reply(text(3));
    return;
  }
  chat[0].trim()
    .split(' ')
    .forEach(tag => ctx.reply(messageText.join('\n'), { chat_id: tag })
      .catch(() => ctx.reply('Error: Chat not found'))
    );
};

module.exports = sendmessage;
