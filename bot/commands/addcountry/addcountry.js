'use strict';

const addcountry = charon => {
  const {
    getAdmins,
    getCountry,
    createCountry,
    getText,
  } = charon.get([
    'getAdmins',
    'getCountry',
    'getText',
    'createCountry',
  ]);
  const text = t => getText('addcountry')[t];
  const { id } = charon.message.from;
  if (!getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }

  if (charon.message.chat.type === 'private') {
    charon.reply(text(2));
    return;
  }

  let title = charon.message
    .text
    .slice('/addcountry'.length)
    .trim();

  if (!title) {
    if (charon.message.chat.title)
      title = charon.message.chat.title;
    else {
      charon.reply(text(3));
      return;
    }
  }
  const link = charon.message.chat.username;

  if (getCountry(link)) {
    charon.reply(text(4));
    return;
  }

  const countries = createCountry(title, link);
  charon.reply(` ${title} ${text(5)}`);
  charon.reply(
    text(6) +
    Object.keys(countries)
      .map(country => countries[country].name)
      .join('\n')
  );
};

module.exports = addcountry;
