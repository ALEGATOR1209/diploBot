'use strict';

const {
  findUser,
  getText,
  getCountry,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getCountry',
  ]);
const text = t => getText('blacklist')[t];

const blacklist = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'Markdown',
  };
  let country;
  if (ctx.message.chat.type === 'private') {
    country = findUser(tag);
    if (!country) {
      ctx.reply(text(1), reply);
      return;
    }
    if (country.hasRevolution) {
      ctx.reply(text(7), reply);
      return;
    }
  } else if (getCountry(ctx.message.chat.username)) {
    country = getCountry(ctx.message.chat.username);
  } else {
    ctx.reply(text(1), reply);
    return;
  }

  const blacklist = country.blacklist;
  if (Object.keys(blacklist).length < 1) {
    ctx.reply(text(6), reply);
    return;
  }
  let answer = text(2) + `*${country.name}*`;
  for (const person in blacklist) {
    answer += `${text(5)}@${person} ` +
      `- ${text(3) + blacklist[person].banTurn + text(4)}.`;
  }
  ctx.reply(answer, reply);
};

module.exports = blacklist;
