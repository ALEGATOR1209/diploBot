'use strict';

const {
  getCountry,
  getAdmins,
  rightsString,
  getText,
  findUser,
  getDead,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getCountry',
    'getAdmins',
    'rightsString',
    'getText',
    'findUser',
    'getDead',
  ]);
const text = t => getText('rights')[t];

const rights = ctx => {
  let tag = ctx.message
    .text
    .match(/ .*$/);
  if (tag) tag = tag[0].trim().slice(1);
  else tag = ctx.message.from.username || ctx.message.from.id;

  const country = findUser(tag);
  if (getAdmins().includes(tag)) {
    ctx.reply(
      `@${tag} ${text(1)}:\n\n${text(2)}`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }
  if (getDead(tag)) {
    ctx.reply(
      text(8),
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  if (!country) {
    ctx.reply(
      text(9),
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const user = country.citizens[tag];
  if (!user) {
    ctx.reply(
      `${text(3)} ${country.name}.`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[user.class];
  ctx.reply(
    `${text(1)}:\n\n` +
    rightsString(userClass.rights) + '\n' +
    (user.inPrison ? text(4) : text(5)) +
    text(6) + userClassName + text(7) + country.name,
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = rights;
