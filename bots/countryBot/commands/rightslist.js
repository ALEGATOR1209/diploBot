'use strict';

const {
  getAllRights
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAllRights'
  ]);

const rightslist = ctx => ctx.reply(
  'Все права:\n\n✅ ' + getAllRights
    .join('\n✅ '),
  { reply_to_message_id: ctx.message.message_id }
);

module.exports = rightslist;
