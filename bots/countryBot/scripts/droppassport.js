'use strict';

const getAdmins = require('./getAdmins');
const findUser = require('./findUser');
const retakePassport = require('./retakePassport');
const getText = id => require('./getText')(`droppasport.${id}`);

const droppassport = ctx => {
  const { username, id } = ctx.message.from;
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(getText(1), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  const userCountry = findUser(username) || findUser(id);
  if (!userCountry) {
    ctx.reply(getText(2), { reply_to_message_id: ctx.message.message_id });
    return;
  }
  if (username) retakePassport(userCountry, username);
  else retakePassport(userCountry, id);
  ctx.reply(getText(3), { reply_to_message_id: ctx.message.message_id });
};

module.exports = droppassport;
