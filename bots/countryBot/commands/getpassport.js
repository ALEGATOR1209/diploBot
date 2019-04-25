'use strict';

const {
  getAdmins,
  givePassport,
  findUser,
  getCountry,
  getText,
  getDead
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'givePassport',
    'findUser',
    'getCountry',
    'getText',
    'getDead',
  ]);
const text = t => getText('getpassport')[t];

const getpassport = ctx => {
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) {
    ctx.reply(text(6));
    return;
  }

  const { username, id } = ctx.message.from;
  if (!username) {
    ctx.reply(text(0), { reply_to_message_id: ctx.message.message_id });
    return;
  }
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(text(1), { reply_to_message_id: ctx.message.message_id });
    return;
  }
  if (getDead(username) || getDead(id)) {
    ctx.reply(text(1));
    return;
  }
  const userCountry = findUser(username) || findUser(id);
  if (userCountry) {
    ctx.reply(
      `${text(2)} ${userCountry.name}!`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }
  if (country.blacklist[username]) {
    ctx.reply(
      text(7),
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  if (username) {
    givePassport(country, username);
    ctx.reply(
      `${text(3)} ${country.name}, @${username}!\n` +
      text(4) + country.migrantClass,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }
  ctx.reply(
    text(0),
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = getpassport;
