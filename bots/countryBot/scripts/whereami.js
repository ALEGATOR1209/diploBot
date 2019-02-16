'use strict';

const getCountry = require('./getCountry');
const getText = id => require('./getText')(`whereami.${id}`);

const whereami = ctx => {
  if (ctx.message.chat.type === 'private') {
    ctx.reply(getText(1));
    return;
  }
  const reply = { reply_to_message_id: ctx.message.message_id };
  const link = ctx.message.chat.username || ctx.message.char.id;
  const country = getCountry(link);
  if (country) {
    ctx.reply(getText(2) + country.name, reply);
  } else ctx.reply(getText(3), reply);
};

module.exports = whereami;
