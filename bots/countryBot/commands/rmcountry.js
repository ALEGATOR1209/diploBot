'use strict';

const {
  getAdmins,
  getCountry,
  deleteCountry,
  getText,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getCountry',
    'deleteCountry',
    'getText',
  ]);
const text = t => getText('rmcountry')[t];

const rmcountry = ctx => {
  const username = ctx.message.from.username;
  if (!getAdmins().includes(username)) {
    ctx.reply(text(1));
    return;
  }

  const link = ctx.message.chat.username;

  const country = getCountry(link);
  if (!country) {
    ctx.reply(getText(2));
    return;
  }
  const countries = deleteCountry(link);
  console.log(countries);
  ctx.reply(`${ctx.message.chat.title} ${getText(3)}.`);
  ctx.reply(
    getText(4) + '\n\n' +
    Object.keys(countries)
      .map(country => countries[country].name)
      .join('\n')
  );
};

module.exports = rmcountry;
