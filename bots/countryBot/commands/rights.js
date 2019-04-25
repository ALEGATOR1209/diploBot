'use strict';

const {
  getAdmins,
  rightsString,
  getText,
  findUser,
  getDead,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'rightsString',
    'getText',
    'findUser',
    'getDead',
  ]);
const text = t => getText('rights')[t];

const rights = ctx => {
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };

  let tag = ctx.message
    .text
    .match(/@[^@]*$/gi);
  if (tag) tag = tag[0]
    .trim()
    .slice(1);
  else tag = ctx.message.from.username || ctx.message.from.id;

  const country = findUser(tag);
  if (getAdmins().includes(tag)) {
    ctx.reply(
      `@${tag} ${text(1)}:\n\n${text(2)}`,
      reply
    );
    return;
  }
  if (getDead(tag)) {
    ctx.reply(
      text(8),
      reply
    );
    return;
  }

  if (tag === 'dipl_countryBot') {
    ctx.reply(
      text(1).replace('{user}', `@${tag}`) + text(11),
      reply
    );
    return;
  }

  if (!country) {
    ctx.reply(
      text(9).replace('{user}', `@${tag}`),
      reply
    );
    return;
  }

  const user = country.citizens[tag];
  if (!user) {
    ctx.reply(
      `${text(3)} ${country.name}.`,
      reply
    );
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[user.class];
  ctx.reply(
    text(1).replace('{user}', `@${tag}`) +
    rightsString(userClass.rights) + '\n' +
    (user.inPrison ? text(4) : text(5)) +
    text(6) + userClassName + text(7) + country.name +
    (tag === ctx.message.from.username ? text(10) : ''),
    reply
  );
};

module.exports = rights;
