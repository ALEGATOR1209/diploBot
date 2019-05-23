'use strict';

const rmcountry = charon => {
  const {
    getAdmins,
    getCountry,
    deleteCountry,
    getText,
  } = charon.get([
    'getAdmins',
    'getCountry',
    'deleteCountry',
    'getText',
  ]);
  const text = t => getText('rmcountry')[t];

  const { id } = charon.message.from;
  if (!getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }

  const link = charon.message.chat.username;

  const country = getCountry(link);
  if (!country) {
    charon.reply(text(2));
    return;
  }
  const countries = deleteCountry(link);
  charon.reply(`${charon.message.chat.title} ${text(3)}.`);
  charon.reply(
    text(4) + '\n\n' +
    Object.keys(countries)
      .map(country => countries[country].name)
      .join('\n')
  );
};

module.exports = rmcountry;
