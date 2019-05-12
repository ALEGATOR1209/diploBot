'use strict';

const {
  getAdmins,
  getCountry,
  deleteCountry,
  getText,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getCountry',
    'deleteCountry',
    'getText',
  ]);
const text = t => getText('rmcountry')[t];

const rmcountry = ctx => {
  const { id } = ctx.message.from;
  if (!getAdmins().includes(id)) {
    ctx.reply(text(1));
    return;
  }

  const link = ctx.message.chat.username;

  const country = getCountry(link);
  if (!country) {
    ctx.reply(text(2));
    return;
  }
  const countries = deleteCountry(link);
  ctx.reply(`${ctx.message.chat.title} ${text(3)}.`);
  ctx.reply(
    text(4) + '\n\n' +
    Object.keys(countries)
      .map(country => countries[country].name)
      .join('\n')
  );
};

module.exports = rmcountry;
