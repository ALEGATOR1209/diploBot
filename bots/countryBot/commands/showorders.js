'use strict';

const {
  getAdmins,
  findUser,
  getText,
  getDead,
  getOrders,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'getOrders',
  ]);
const text = t => getText('showorders')[t];

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

const showorders = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;

  if (getAdmins().includes(tag)) {
    ctx.reply(text(1));
    return;
  }

  if (getDead(tag)) {
    ctx.reply(text(2));
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(3));
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на управление армией')) {
    ctx.reply(4);
    return;
  }

  ctx.reply(text(5) + country.name)
    .then(() => {
      const orders = getOrders(country.chat);
      console.dir(orders);
      if (Object.keys(orders) < 1) {
        ctx.reply(text(6));
        return;
      }
      for (const order in orders) {
        if (order === 'caption') continue;
        ordersHandlers[order](ctx, orders);
      }
    });
};

module.exports = showorders;
