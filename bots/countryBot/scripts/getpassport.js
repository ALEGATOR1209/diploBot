'use strict';

const getAdmins = require('./getAdmins');
const givePassport = require('./givePassport');
const findUser = require('./findUser');
const getCountry = require('./getCountry');
const getText = id => require('./getText')(`getpassport.${id}`);

const getpassport = ctx => {
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  const { username, id } = ctx.message.from;
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(getText(1), { reply_to_message_id: ctx.message.message_id });
    return;
  }
  const userCountry = findUser(username) || findUser(id);
  if (userCountry) {
    ctx.reply(
      `${getText(2)} ${userCountry.name}!`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  if (username) {
    givePassport(country, username);
    ctx.reply(
      `${getText(3)} ${country.name}, @${username}!\n` + getText(4),
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }
  givePassport(country, id);
  ctx.reply(
    `${getText(3)} ${country.name}!\n` + getText(4),
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = getpassport;
