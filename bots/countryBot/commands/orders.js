'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  getAllCountries,
  getAdminsChat,
  setState,
  getText,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getAllCountries',
    'getAdminsChat',
    'setState',
    'getText',
  ]);
const text = t => getText('orders')[t];

const orders = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (!getAdmins().includes(username)) {
    ctx.reply(text(1), reply);
    return;
  }
  const rightChat = ctx.message.chat.id === getAdminsChat() ||
    (
      ctx.message.chat.type === 'private' &&
      getAdmins().includes(ctx.message.chat.username)
    );
  if (!rightChat) {
    ctx.reply(text(2), reply);
    return;
  }

  const list = Object.keys(getAllCountries());
  if (list.length < 1) {
    ctx.reply(text(3), reply);
    return;
  }

  ctx.reply(
    text(4),
    Extra
      .load(reply)
      .markup(Markup.keyboard(list)
        .oneTime()
        .resize()
        .selective(true)
      )
  );
  setState(id, 'watchingOrders', 'choosingCountry');
};

module.exports = orders;
