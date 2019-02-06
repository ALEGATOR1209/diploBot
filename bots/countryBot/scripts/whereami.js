'use strict';

const getCountry = require('./getCountry');

const whereami = ctx => {
  if (ctx.message.chat.type === 'private') {
    ctx.reply('You\'re in ban.');
    return;
  }
  const link = ctx.message.chat.username || ctx.message.char.id;
  const country = getCountry(link);
  if (country) {
    ctx.reply(
      `You're citizen of ${country.name}`,
      { reply_to_message_id: ctx.message.message_id }
    );
  } else ctx.reply(
    'I don\'t know. It seems like there is no country in this chat.',
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = whereami;
/*****************
USAGE: /whereami - sends name of country current chat belongs to
******************/
