'use strict';

const getAllRights = require('./getAllRights');

const rightlist = ctx => ctx.reply(
  'Все права:\n\n✅ ' + getAllRights
    .join('\n✅ '),
  { reply_to_message_id: ctx.message.message_id }
);

module.exports = rightlist;
