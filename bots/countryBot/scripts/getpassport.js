'use strict';

const getAdmins = require('./getAdmins');
const givePassport = require('./givePassport');
const findUser = require('./findUser');
const getCountry = require('./getCountry');

const getpassport = ctx => {
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  const { username, id } = ctx.message.from;
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(
      'Admins can\'t be a citizens!',
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }
  const userCountry = findUser(username) || findUser(id);
  if (userCountry) {
    ctx.reply(
      `You're also is a citizen of ${userCountry.name}!`,
      { reply_to_message_id: ctx.message.message_id }
    );
  }

  if (username) {
    givePassport(country, username);
    ctx.reply(
      `Welcome in ${country.name}, @${username}!\n` +
      'You now is a common citizen of this country.',
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }
  givePassport(country, id);
  ctx.reply(
    `Welcome in ${country.name}!\n` +
    'You now is a common citizen of this country.',
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = getpassport;
