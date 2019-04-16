'use strict';

const getAdmins = require('./getAdmins');
const getText = id => require('./getText')(`sendmessage.${id}`);
const {
  getAdmins,
  getText
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getText',
  ]);
const text = t => getText('addclass')[t];

const sendmessage = ctx => {
  const { username, id } = ctx.message.from;
  if (!(getAdmins().includes(username) || getAdmins().includes(id))) {
    ctx.reply(text(1));
    return;
  }
  const chat = ctx.message.text
    .match(/ @[^(\n)]*/g);
  const text = ctx.message.text
    .match(/\n.*/g);
  if (!chat) {
    ctx.reply(text(2));
    ctx.reply(text(3));
    return;
  }
  if (!text) {
    ctx.reply(text(4));
    ctx.reply(text(3));
    return;
  }
  chat[0].trim()
    .split(' ')
    .forEach(tag => ctx.reply(text.join('\n'), { chat_id: tag })
      .catch(() => ctx.reply('Error: Chat not found'))
    );
};

module.exports = sendmessage;
