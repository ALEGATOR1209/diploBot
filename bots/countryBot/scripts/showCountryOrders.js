'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  getAllCountries,
  getAdminsChat,
  setState,
  getText,
  getOrders,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getAllCountries',
    'getAdminsChat',
    'setState',
    'getText',
    'getOrders',
  ]);
const text = t => getText('orders')[t];

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

const showCountryOrders = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (!getAdmins().includes(username)) {
    ctx.reply(
      text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'watchingOrders', null);
    return;
  }
  const rightChat = ctx.message.chat.id === getAdminsChat() ||
    (
      ctx.message.chat.type === 'private' &&
      getAdmins().includes(ctx.message.chat.username)
    );
  if (!rightChat) {
    ctx.reply(
      text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'watchingOrders', null);
    return;
  }

  const list = Object.keys(getAllCountries());
  if (list.length < 1) {
    ctx.reply(
      text(3),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'watchingOrders', null);
    return;
  }

  const country = getAllCountries()[ctx.message.text];
  if (!country) {
    ctx.reply(
      text(6),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'watchingOrders', null);
    return;
  }

  ctx.reply(
    text(5) + country.name,
    Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true)
        .selective(true)
      )
  ).then(() => {
    const orders = getOrders(country.chat);
    if (Object.keys(orders) < 1) {
      ctx.reply(text(7), reply);
      return;
    }
    for (const order in orders) {
      if (order === 'caption') continue;
      ordersHandlers[order](ctx, orders);
    }
  });
  setState(id, 'watchingOrders', null);
};

module.exports = showCountryOrders;
