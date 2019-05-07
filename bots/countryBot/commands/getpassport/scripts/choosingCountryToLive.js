'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const noState = require('./noState');
const {
  addToMigrantQueue,
  getAdmins,
  findUser,
  getAllCountries,
  getText,
  getDead,
  setState,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'addToMigrantQueue',
    'getAdmins',
    'givePassport',
    'findUser',
    'getAllCountries',
    'getText',
    'getDead',
    'setState',
  ]);
const text = id => getText('getpassport')[id];

const choosingCountryToLive = ctx => {
  const DEFAULT_MARKUP = Markup
    .removeKeyboard(true)
    .selective(true);
  const reply = (text, markup = DEFAULT_MARKUP) => ctx.reply(
    text,
    Extra
      .HTML()
      .load({ reply_to_message_id: ctx.message.message_id })
      .markup(markup)
  );
  if (ctx.message.chat.type !== 'private') {
    return;
  }

  const { id } = ctx.message.from;
  if (getAdmins().includes(id)) {
    reply(text(0) + text(2));
    setState(id, 'getpassport', null);
    return;
  }

  if (getDead(id)) {
    reply(text(0) + text(3));
    setState(id, 'getpassport', null);
    return;
  }
  const motherland = findUser(id);
  if (motherland) {
    reply(text(0) + text(3).replace('{country}', motherland.name));
    setState(id, 'getpassport', null);
    return;
  }

  try {
    const countryName = ctx.message.text
      .trim();
    if (countryName === text(8)) {
      reply(text(0) + text(9));
      setState(id, 'getpassport', null);
      return;
    }
    let country;
    const countrylist = getAllCountries();
    for (const realm in countrylist) {
      if (countrylist[realm].name === countryName)
        country = countrylist[realm];
    }
    if (country.blacklist[id]) {
      reply(text(0) + text(10));
      setState(id, 'getpassport', null);
      return;
    }

    reply(text(0) + text(11));
    addToMigrantQueue(country.chat, id);
    setState(id, 'getpassport', null);

  } catch (e) {
    reply(text(0) + text(7));
    setState(id, 'getpassport', null);
    setTimeout(() => noState(ctx), 0);
  }
};

module.exports = choosingCountryToLive;
