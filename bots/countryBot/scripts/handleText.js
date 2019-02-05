'use strict';
const getAdmins = require('./getAdmins');

const handleText = ctx => {
  const { type } = ctx.message.chat;

  if (type === 'private') {
    const admins = getAdmins();
    ctx.reply('Robot cannot speak to human. I will be punished!');
    ctx.reply(
      'But you can speak to my developers or other admins as well.' +
      `\n@${admins.join('\n@')}`
    );
    return;
  }
};

module.exports = handleText;
