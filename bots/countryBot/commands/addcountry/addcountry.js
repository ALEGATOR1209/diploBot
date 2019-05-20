'use strict';

const {
  getAdmins,
  getCountry,
  createCountry,
  getText,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getCountry',
    'getText',
    'createCountry',
  ]);
const text = t => getText('addcountry')[t];

const addcountry = ctx => {
  const { id } = ctx.message.from;
  if (!getAdmins().includes(id)) {
    ctx.reply(text(1));
    return;
  }

  if (ctx.message.chat.type === 'private') {
    ctx.reply(text(2));
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
      ctx.reply(text(3));
      return;
    }
  }
  const link = ctx.message.chat.username;

  if (getCountry(link)) {
    ctx.reply(text(4));
    return;
  }

  const countries = createCountry(title, link);
  ctx.reply(` ${title} ${text(5)}`);
  ctx.reply(
    text(6) +
    Object.keys(countries)
      .map(country => countries[country].name)
      .join('\n')
  );
};

module.exports = addcountry;
