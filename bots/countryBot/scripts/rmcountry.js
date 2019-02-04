'use strict';

const isAdmin = require('./isAdmin');
const getCountry = require('./getCountry');
const deleteCountry = require('./deleteCountry.js');

const rmcountry = ctx => {
  const username = ctx.message.from.username;
  if (!isAdmin(username)) {
    ctx.reply('You have no rights.');
    return;
  }

  let name = ctx.message
    .text
    .match(/ .*$/);
  if (!name) {
    ctx.reply('No country name.');
    return;
  }
  name = name[0].trim();

  const country = getCountry(name);
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
