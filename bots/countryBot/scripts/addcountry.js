'use strict';

const isAdmin = require('./isAdmin');
const getCountry = require('./getCountry');
const createCountry = require('./createCountry');

const addcountry = ctx => {
  const username = ctx.message.from.username;
  if (!isAdmin(username)) {
    ctx.reply('You have no rights.');
    return;
  }

  if (ctx.message.chat.type === 'private') {
    ctx.reply('Cannot create countries in private chats.');
    return;
  }

  let title = ctx.message
    .text
    .slice('/addcountry'.length)
    .trim();

  if (!title) {
    if (ctx.message.chat.title)
      title = ctx.message.chat.title;
    else {
      ctx.reply('Country name is not provided.');
      return;
    }
  }
  const link = ctx.message.chat.username;

  if (getCountry(link)) {
    ctx.reply('Country already exists.');
    return;
  }

  const countries = createCountry(title, link);
  ctx.reply(`Young ${title} country appears on politic arena.`);
  ctx.reply(`Countries list:\n\n${countries.map(c => c.name).join('\n')}`);
};

module.exports = addcountry;

/***************************
USAGE:
 /addcountry Ukraine ukr - create Ukraine in chat t.me/ukr
 /addcountry Ukraine - create Ukraine in current group chat

****************************/
