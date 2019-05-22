'use strict';

const ordersHandlers = {
  text: ({ reply }, orders) => reply(orders.text),
  photo: ({ replyWithPhoto }, orders) => replyWithPhoto(
    orders.photo,
    null,
    { caption: orders.caption }
  ),
  document: ({ replyWithDocument }, orders) => replyWithDocument(
    orders.document.file_id,
    null,
    { caption: orders.caption }
  ),
  voice: ({ replyWithVoice }, orders) => replyWithVoice(
    orders.voice.file_id,
    null,
    { caption: orders.caption }
  ),
  sticker: ({ replyWithSticker }, orders) => replyWithSticker(
    orders.sticker.file_id,
    null,
    { caption: orders.caption }
  ),
  video: ({ replyWithVideo }, orders) => replyWithVideo(
    orders.video.file_id,
    null,
    { caption: orders.caption }
  ),
  audio: ({ replyWithAudio }, orders) => replyWithAudio(
    orders.audio.file_id,
    null,
    { caption: orders.caption }
  ),
};

const showorders = charon => {
  const {
    getAdmins,
    findUser,
    getText,
    getDead,
    getOrders,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'getOrders',
  ]);
  const text = t => getText('showorders')[t];
  const reply = text => charon.reply(text, null, {});

  const { id } = charon.message.from;

  if (getAdmins().includes(id)) {
    reply(text(1));
    return;
  }

  if (getDead(id)) {
    reply(text(2));
    return;
  }

  const country = findUser(id);
  if (!country) {
    reply(text(3));
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('COMMAND_ARMIES')) {
    reply(text(4));
    return;
  }

  reply(text(5) + country.name)
    .then(() => {
      const orders = getOrders(country.chat);
      if (Object.keys(orders) < 1) {
        reply(text(6));
        return;
      }
      for (const order in orders) {
        if (order === 'caption') continue;
        ordersHandlers[order](charon, orders);
      }
    });
};

module.exports = showorders;
