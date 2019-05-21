'use strict';

const noState = charon => {
  const {
    getAdmins,
    findUser,
    getAllCountries,
    getText,
    getDead,
    setState,
  } = charon.get([
    'getAdmins',
    'givePassport',
    'findUser',
    'getAllCountries',
    'getText',
    'getDead',
    'setState',
  ]);
  const text = id => getText('getpassport')[id];

  if (charon.message.chat.type !== 'private') {
    charon.reply(text(0) + text(1));
    return;
  }

  const { id } = charon.message.from;
  if (getAdmins().includes(id)) {
    charon.reply(text(0) + text(3));
    return;
  }

  if (getDead(id)) {
    charon.reply(text(0) + text(3));
    return;
  }
  const country = findUser(id);
  if (country) {
    charon.reply(text(0) + text(4).replace('{country}', country.name));
    return;
  }

  const countrylist = [];
  const countries = getAllCountries();
  for (const country in countries) {
    if (countries[country].blacklist[id]) continue;
    if (countries[country].immigrantQueue.includes(id)) {
      charon.reply(text(0) + text(13));
    }
    countrylist.push(countries[country].name);
  }
  if (countrylist.length < 1) {
    charon.reply(text(0) + text(5));
    return;
  }
  charon.reply(
    text(0) + text(6),
    { buttons: [...countrylist, text(8)] }
  );
  setState(id, 'getpassport', 'choosingCountryToLive');
};

module.exports = noState;
