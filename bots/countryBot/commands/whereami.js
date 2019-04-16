'use strict';

const { getCountry, getText } = require('../../imports')
  .few('countryBot', 'scripts',
    [
      'getCountry',
      'getText',
    ]);
const text = t => getText('whereami')[t];
const whereami = ctx => {
  if (ctx.message.chat.type === 'private') {
    ctx.reply(text(1));
    return;
  }
  const reply = { reply_to_message_id: ctx.message.message_id };
  const link = ctx.message.chat.username || ctx.message.char.id;
  const country = getCountry(link);
  if (country) {
    ctx.reply(text(2) + country.name, reply);
  } else ctx.reply(text(3), reply);
};

module.exports = whereami;
