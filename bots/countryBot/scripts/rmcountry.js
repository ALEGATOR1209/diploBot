'use strict';

const getAdmins = require('./getAdmins');
const getCountry = require('./getCountry');
const deleteCountry = require('./deleteCountry.js');

const rmcountry = ctx => {
  const username = ctx.message.from.username;
  if (!getAdmins().include(username)) {
    ctx.reply('You have no rights.');
    return;
  }

  const link = ctx.message.chat.username;
  let name = ctx.message
    .text
    .slice('/rmcountry'.length);
  if (!name) {
    if (ctx.message.chat.title)
      name = ctx.message.chat.title;
    else {
      ctx.reply('No country name.');
      return;
    }
  }

  const country = getCountry(link);
  if (!country) {
    ctx.reply('Country does not exist!');
    return;
  }
  const list = deleteCountry(name);
  ctx.reply(`${name} destroyed.`);
  ctx.reply(`Current countries list:\n\n${list.map(c => c.name).join('\n')}`);
};

module.exports = rmcountry;

/**************************
USAGE:
  /rmcountry Ukraine - remove Ukraine
**************************/
