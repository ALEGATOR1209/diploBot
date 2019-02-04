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

  const text = ctx.message
    .text
    .slice('/addcountry'.length)
    .trim()
    .split(' ');
  if (text.length > 2) {
    ctx.reply('USAGE:\n` /addcountry name link `');
    return;
  }
  let title = text.shift();
  const link = text.pop();

  if (!title) {
    if (ctx.message.chat.type === 'private') {
      ctx.reply('No country name provided.');
      return;
    }
    title = ctx.message.chat.title;
  }

  if (!link) {
    if (ctx.message.chat.type === 'private') {
      ctx.reply('No country chat link provided.');
      return;
    }

    if (ctx.message.chat.username)
      title = ctx.message.chat.username;
    else title = ctx.message.chat.id;
  }

  if (getCountry(title)) {
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
