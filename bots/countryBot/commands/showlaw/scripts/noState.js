'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  getCountry,
  setState,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getCountry',
    'setState',
  ]);
const text = t => getText('showlaw')[t];

const noState = ctx => {
  const { id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };
  let country;
  if (ctx.message.chat.type === 'private') {
    country = findUser(id);
    if (!country) {
      ctx.reply(text(0) + text(1), reply);
      return;
    }
  } else if (getCountry(ctx.message.chat.username)) {
    country = getCountry(ctx.message.chat.username);
  } else {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  const lawlist = country.laws;
  const list = Object.keys(lawlist)
    .filter(law => !law.WIP);
  if (list.length < 1) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }

  ctx.reply(
    text(0) + text(8).replace('{country}', country.name),
    Extra
      .load(reply)
      .markup(Markup.keyboard([...list, text(6)])
        .oneTime()
        .resize()
        .selective(true)
      )
  );
  setState(id, 'showlaw', country.chat);
};

module.exports = noState;
