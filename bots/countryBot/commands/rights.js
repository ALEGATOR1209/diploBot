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

  const { username: link, id: countryId } = ctx.message.chat;
  const country = getCountry(link) || getCountry(countryId) || findUser(tag);
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

  const classlist = country.classes;
  const userClass = classlist[user.class];
  const userClassName = user.class;
  ctx.reply(
    `${text(1)}:\n\n` +
    rightsString(userClass.rights) + '\n' +
    (user.inPrison ? text(4) : text(5)) +
    text(6) + userClassName + text(7) + country.name,
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = rights;
