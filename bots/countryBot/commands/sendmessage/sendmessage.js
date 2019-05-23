'use strict';

const sendmessage = charon => {
  const {
    getAdmins,
    getText
  } = charon.get([
    'getAdmins',
    'getText',
  ]);
  const text = t => getText('sendmessage')[t];

  const { id } = charon.message.from;
  if (!getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }
  const chat = charon.message.text
    .match(/ @[^(\n)]*/g);
  const messageText = charon.message.text
    .match(/\n.*/g);
  if (!chat) {
    charon.reply(text(2));
    charon.reply(text(3));
    return;
  }
  if (!messageText) {
    charon.reply(text(4));
    charon.reply(text(3));
    return;
  }
  chat[0].trim()
    .split(' ')
    .forEach(tag => charon.reply(messageText.join(''), null, { chat_id: tag })
      .catch(() => charon.reply('Error: Chat not found'))
    );
};

module.exports = sendmessage;
