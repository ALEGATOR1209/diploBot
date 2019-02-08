'use strict';

const getAdmins = require('./getAdmins');

const sendmessage = ctx => {
  const { username, id } = ctx.message.from;
  if (!(getAdmins().includes(username) || getAdmins().includes(id))) {
    ctx.reply('This command avaliable only for admins').
      return;
  }
  const chat = ctx.message.text
    .match(/ @[^(\n)]*/g);
  const text = ctx.message.text
    .match(/\n.*/g);
  if (!chat) {
    ctx.reply('Error: Targeted chat\'s tag not found.');
    ctx.reply('Use:\n/sendmessage @chat1 @chat2\nText');
    return;
  }
  if (!text) {
    ctx.reply('Error: Text not found.');
    ctx.reply('Use:\n/sendmessage @chat1 @chat2\nText');
    return;
  }
  chat[0].trim()
    .split(' ')
    .forEach(tag => ctx.reply(text.join('\n'), { chat_id: tag })
      .catch(() => ctx.reply('Error: Chat not found'))
    );
};

module.exports = sendmessage;
