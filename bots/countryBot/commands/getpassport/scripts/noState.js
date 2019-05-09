'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  findUser,
  getAllCountries,
  getText,
  getDead,
  setState,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'givePassport',
    'findUser',
    'getAllCountries',
    'getText',
    'getDead',
    'setState',
  ]);
const text = id => getText('getpassport')[id];

const noState = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (ctx.message.chat.type !== 'private') {
    ctx.reply(
      text(0) + text(1),
      reply
    );
    return;
  }

  const { id } = ctx.message.from;
  if (getAdmins().includes(id)) {
    ctx.reply(
      text(0) + text(3),
      reply
    );
    return;
  }

  if (getDead(id)) {
    ctx.reply(
      text(0) + text(3),
      reply
    );
    return;
  }
  const country = findUser(id);
  if (country) {
    ctx.reply(
      text(0) + text(4).replace('{country}', country.name),
      reply
    );
    return;
  }

  const countrylist = [];
  const countries = getAllCountries();
  for (const country in countries) {
    if (countries[country].blacklist[id]) continue;
    if (countries[country].immigrantQueue.includes(id)) {
      ctx.reply(text(0) + text(13))
    }
    countrylist.push(countries[country].name);
  }
  if (countrylist.length < 1) {
    ctx.reply(text(0) + text(5));
    return;
  }
  ctx.reply(
    text(0) + text(6),
    Extra
      .load(reply)
      .markup(
        Markup.keyboard([...countrylist, text(8)])
          .oneTime()
          .resize()
          .selective(true)
      )
  );
  setState(id, 'getpassport', 'choosingCountryToLive');
};

module.exports = noState;
