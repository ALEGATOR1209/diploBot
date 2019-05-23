'use strict';

const droppassport = charon => {
  const {
    getAdmins,
    findUser,
    setEmigrantQueue,
    getText,
  } = charon.get([
    'getAdmins',
    'findUser',
    'setEmigrantQueue',
    'getText',
  ]);
  const text = t => getText('droppassport')[t];

  const { id } = charon.message.from;
  if (getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }

  const country = findUser(id);
  if (!country) {
    charon.reply(text(2));
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(4));
    return;
  }

  const queue = country.emigrantQueue;
  setEmigrantQueue(country.chat, [...queue, id]);
  charon.reply(text(3), { reply_to_message_id: charon.message.message_id });
};

module.exports = droppassport;
