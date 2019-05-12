'use strict';

const {
  getAllRights,
  getText
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAllRights',
    'getText'
  ]);
const text = id => getText('rightslist')[id];

const rightslist = ctx => ctx.reply(
  text(1) + text(2) + Object.keys(getAllRights)
    .map(right => getAllRights[right])
    .join(text(2)),
  { reply_to_message_id: ctx.message.message_id }
);

module.exports = rightslist;
