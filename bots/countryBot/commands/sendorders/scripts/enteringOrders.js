'use strict';

const enteringOrders = charon => {
  const {
    getAdmins,
    findUser,
    getText,
    getDead,
    setState,
    setOrders,
    getAdminsChat,
    showorders,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'setState',
    'setOrders',
    'getAdminsChat',
    'showorders'
  ]);
  const text = t => getText('sendorders')[t];

  const { id } = charon.message.from;
  if (getAdmins().includes(id)) {
    charon.reply(text(0) + text(1));
    setState(id, 'sendorders', null);
    return;
  }

  if (getDead(id)) {
    charon.reply(text(0) + text(2));
    setState(id, 'sendorders', null);
    return;
  }
  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(3));
    setState(id, 'sendorders', null);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('COMMAND_ARMIES')) {
    charon.reply(text(0) + text(4));
    setState(id, 'sendorders', null);
    return;
  }

  const {
    text: messageText,
    photo,
    video,
    voice,
    caption,
    sticker,
    document,
    audio,
  } = charon.message;

  setOrders(country.chat, {
    text: messageText,
    photo: photo ?
      photo.sort((a, b) => (a.size < b.size ? 1 : -1))[0].file_id :
      undefined,
    caption,
    document,
    voice,
    sticker,
    video,
    audio,
  });
  setState(id, 'sendorders', null);
  charon.reply(text(0) + text(6)).then(() => {
    charon.message.chat.id = getAdminsChat();
    showorders(charon);
  });
};

module.exports = enteringOrders;
