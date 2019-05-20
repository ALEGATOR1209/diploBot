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
} = require('../../../../imports').few('countryBot', 'scripts',
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

const answer = (ctx, text) => ctx.reply(
  text,
  Extra
    .load({ reply_to_message_id: ctx.message.message_id })
    .markup(Markup
      .removeKeyboard(true)
      .selective(true)
    )
);
const choosingCountry = ctx => {
  const reply = answer.bind(null, ctx);
  const { id } = ctx.message.from;
  if (!getAdmins().includes(id)) {
    reply(text(1));
    setState(id, 'orders', null);
    return;
  }
  const rightChat = ctx.message.chat.id === getAdminsChat() ||
    (
      ctx.message.chat.type === 'private' &&
      getAdmins().includes(ctx.message.chat.id)
    );
  if (!rightChat) {
    reply(text(2));
    setState(id, 'orders', null);
    return;
  }

  const countries = getAllCountries();
  if (Object.keys(countries).length < 1) {
    reply(text(3));
    setState(id, 'orders', null);
    return;
  }

  const country = countries[
    Object.keys(countries)
      .find(state => countries[state].name === ctx.message.text)
  ];
  if (!country) {
    reply(text(6));
    setState(id, 'orders', null);
    return;
  }

  reply(text(5) + country.name)
    .then(() => {
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
  setState(id, 'orders', null);
};

module.exports = choosingCountry;
