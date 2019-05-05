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
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'givePassport',
    'findUser',
    'getAllCountries',
    'getText',
    'getDead',
    'setState',
  ]);
const text = t => getText('getpassport')[t];

const getpassport = ctx => {
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (ctx.message.chat.type !== 'private') {
    ctx.reply(
      text(0) + text(1),
      reply
    );
    return;
  }

  const { id } = ctx.message.from;
  if (getAdmins(id)) {
    ctx.reply(
      text(0) + text(2),
      reply
    );
    return;
  }

  if (getDead(id)) {
    ctx.reply(
      text(0) + text(2),
      reply
    );
    return;
  }
  const country = findUser(id);
  if (country) {
    ctx.reply(
      text(0) + text(3).replace('{country}', country.name),
      reply
    );
    return;
  }

  const countrylist = [];
  const countries = getAllCountries();
  console.dir(countries);
  for (const country in countries) {
    if (countries[country].blacklist[id]) continue;
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
        Markup.keyboard(countrylist)
          .oneTime()
          .resize()
          .selective(true)
      )
  );
  setState(id, 'choosingCountryToLive', 1);
};

module.exports = getpassport;
