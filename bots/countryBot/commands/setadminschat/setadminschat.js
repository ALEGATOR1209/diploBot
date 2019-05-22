'use strict';

const setadminschat = charon => {
  const {
    getAdmins,
    setAdminChat,
    getText,
  } = charon.get([
    'getAdmins',
    'setAdminChat',
    'getText',
  ]);
  const text = t => getText('setadminschat')[t];
  const { id } = charon.message.from;

  if (!getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }

  const chat = charon.message.chat.id;
  setAdminChat(chat);
  charon.reply(text(2));
};

module.exports = setadminschat;
