'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  getCountry,
  setState,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getCountry',
    'setState',
  ]);
const text = t => getText('laws')[t];

const laws = ctx => {
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
  } else if (getCountry(ctx.message.chat.username)) {
    country = getCountry(ctx.message.chat.username);
  } else {
    ctx.reply(text(1), reply);
    return;
  }

  const lawlist = country.laws;
  if (!lawlist) {
    ctx.reply(text(6), reply);
    return;
  }
  let answer = text(2) + `*${country.name.toUpperCase()}*\n\n`;
  for (const law in lawlist) {
    if (lawlist[law].WIP) continue;
    answer +=
      `${text(3)} ${law} ${text(3)}\n` +
      `${text(4)}${lawlist[law].date}${text(5)}\n\n`;
  }
  answer += `\n${text(7)}`;
  ctx.reply(
    answer,
    Extra
      .load(reply)
      .markup(Markup.keyboard([
        text(8),
        ...Object.keys(lawlist),
      ]))
  );
  setState(id, 'choosingLaw', country.chat);
};

module.exports = laws;
