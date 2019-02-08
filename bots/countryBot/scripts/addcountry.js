'use strict';

const getAdmins = require('./getAdmins');
const getCountry = require('./getCountry');
const createCountry = require('./createCountry');
const getText = text => require('./getText')(`addcountry.${text}`);

const addcountry = ctx => {
  const username = ctx.message.from.username;
  if (!getAdmins().includes(username)) {
    ctx.reply(getText(1));
    return;
  }

  if (ctx.message.chat.type === 'private') {
    ctx.reply(getText(2));
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
      ctx.reply(getText(3));
      return;
    }
  }
  const link = ctx.message.chat.username;

  if (getCountry(link)) {
    ctx.reply(getText(4));
    return;
  }

  const countries = createCountry(title, link);
  ctx.reply(` ${title} ${getText(5)}`);
  ctx.reply(
    getText(6) +
    Object.keys(countries)
      .map(country => countries[country].name)
      .join('\n')
  );
};

module.exports = addcountry;
