'use strict';

const getAdmins = require('./getAdmins');
const findUser = require('./findUser');
const retakePassport = require('./retakePassport');

const droppassport = ctx => {
  const { username, id } = ctx.message.from;
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(
      'Admins have no passport!',
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const userCountry = findUser(username) || findUser(id);
  if (!userCountry) {
    ctx.reply(
      'It looks like you\'re stateless.',
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }
  if (username) retakePassport(userCountry, username);
  else retakePassport(userCountry, id);
  ctx.reply(
    'You\'re stateless now!',
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = droppassport;
