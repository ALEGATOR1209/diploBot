'use strict';

const getAdmins = require('./getAdmins');
const getCountry = require('./getCountry');
const deleteCountry = require('./deleteCountry.js');

const rmcountry = ctx => {
  const username = ctx.message.from.username;
  if (!getAdmins().includes(username)) {
    ctx.reply('You have no rights.');
    return;
  }

  const link = ctx.message.chat.username;

  const country = getCountry(link);
  if (!country) {
    ctx.reply('Country does not exist!');
    return;
  }
  const countries = deleteCountry(link);
  console.log(countries);
  ctx.reply(`${ctx.message.chat.title} destroyed.`);
  ctx.reply(
    'Countries list:\n\n' +
    Object.keys(countries)
      .map(country => countries[country].name)
      .join('\n')
  );
};

module.exports = rmcountry;

/**************************
USAGE:
  /rmcountry
**************************/
