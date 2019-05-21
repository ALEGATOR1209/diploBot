'use strict';

const ordersHandlers = {
  text: ({ reply }, orders) => reply(orders.text),
  photo: ({ replyWithPhoto }, orders) => replyWithPhoto(
    orders.photo,
    { caption: orders.caption }
  ),
  document: ({ replyWithDocument }, orders) => replyWithDocument(
    orders.document.file_id,
    { caption: orders.caption }
  ),
  voice: ({ replyWithVoice }, orders) => replyWithVoice(
    orders.voice.file_id,
    { caption: orders.caption }
  ),
  sticker: ({ replyWithSticker }, orders) => replyWithSticker(
    orders.sticker.file_id
  ),
  video: ({ replyWithVideo }, orders) => replyWithVideo(
    orders.video.file_id,
    { caption: orders.caption }
  ),
  audio: ({ replyWithAudio }, orders) => replyWithAudio(
    orders.audio.file_id,
    { caption: orders.caption }
  ),
};

const choosingCountry = charon => {
  const {
    getAdmins,
    getAllCountries,
    getAdminsChat,
    setState,
    getText,
    getOrders,
  } = charon.get([
    'getAdmins',
    'getAllCountries',
    'getAdminsChat',
    'setState',
    'getText',
    'getOrders',
  ]);
  const text = t => getText('orders')[t];

  const { id } = charon.message.from;
  if (!getAdmins().includes(id)) {
    charon.reply(text(1));
    setState(id, 'orders', null);
    return;
  }
  const rightChat = charon.message.chat.id === getAdminsChat() ||
    (
      charon.message.chat.type === 'private' &&
      getAdmins().includes(charon.message.chat.id)
    );
  if (!rightChat) {
    charon.reply(text(2));
    setState(id, 'orders', null);
    return;
  }

  const countries = getAllCountries();
  if (Object.keys(countries).length < 1) {
    charon.reply(text(3));
    setState(id, 'orders', null);
    return;
  }

  const country = countries[
    Object.keys(countries)
      .find(state => countries[state].name === charon.message.text)
  ];
  if (!country) {
    charon.reply(text(6));
    setState(id, 'orders', null);
    return;
  }

  charon.reply(text(5) + country.name)
    .then(() => {
      const orders = getOrders(country.chat) || {};
      if (Object.keys(orders) < 1) {
        charon.reply(text(7));
        return;
      }
      for (const order in orders) {
        if (order === 'caption') continue;
        ordersHandlers[order](charon, orders);
      }
    });
  setState(id, 'orders', null);
};

module.exports = choosingCountry;
