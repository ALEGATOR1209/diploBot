'use strict';

const getAdmins = require('./getAdmins');
const getText = id => require('./getText')(`sendmessage.${id}`);

const sendmessage = ctx => {
  const { username, id } = ctx.message.from;
  if (!(getAdmins().includes(username) || getAdmins().includes(id))) {
    ctx.reply(getText(1));
    return;
  }
  const chat = ctx.message.text
    .match(/ @[^(\n)]*/g);
  const text = ctx.message.text
    .match(/\n.*/g);
  if (!chat) {
    ctx.reply(getText(2));
    ctx.reply(getText(3));
    return;
  }
  if (!text) {
    ctx.reply(getText(4));
    ctx.reply(getText(3));
    return;
  }
  chat[0].trim()
    .split(' ')
    .forEach(tag => ctx.reply(text.join('\n'), { chat_id: tag })
      .catch(() => ctx.reply('Error: Chat not found'))
    );
};

module.exports = sendmessage;
