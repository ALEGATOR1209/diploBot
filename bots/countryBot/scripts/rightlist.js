'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterRigths = new FileSync(`${databases}/rights.json`);

const rightlist = ctx => ctx.reply(
  'Все права:\n\n✅ ' + low(adapterRigths)
    .get('rights')
    .value()
    .join('\n✅ '),
  { reply_to_message_id: ctx.message.message_id }
);

module.exports = rightlist;
