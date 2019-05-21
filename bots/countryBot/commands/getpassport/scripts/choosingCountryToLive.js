'use strict';

const choosingCountryToLive = charon => {
  const {
    setMigrantQueue,
    getAdmins,
    findUser,
    getAllCountries,
    getText,
    getDead,
    setState,
    noState,
  } = charon.get([
    'setMigrantQueue',
    'getAdmins',
    'givePassport',
    'findUser',
    'getAllCountries',
    'getText',
    'getDead',
    'setState',
    'noState',
  ]);
  const text = id => getText('getpassport')[id];
  if (charon.message.chat.type !== 'private') {
    return;
  }

  const { id } = charon.message.chat;
  if (getAdmins().includes(id)) {
    charon.reply(text(0) + text(2));
    setState(id, 'getpassport', null);
    return;
  }

  if (getDead(id)) {
    charon.reply(text(0) + text(3));
    setState(id, 'getpassport', null);
    return;
  }
  const motherland = findUser(id);
  if (motherland) {
    charon.reply(text(0) + text(3).replace('{country}', motherland.name));
    setState(id, 'getpassport', null);
    return;
  }

  try {
    const countryName = charon.message.text
      .trim();
    if (countryName === text(8)) {
      charon.reply(text(0) + text(9));
      setState(id, 'getpassport', null);
      return;
    }
    let country;
    const countrylist = getAllCountries();
    for (const realm in countrylist) {
      if (countrylist[realm].name === countryName)
        country = countrylist[realm];
    }
    if (country.blacklist[id]) {
      charon.reply(text(0) + text(10));
      setState(id, 'getpassport', null);
      return;
    }

    if (country.immigrantQueue.includes(id)) {
      charon.reply(text(0) + text(12));
      setState(id, 'getpassport', null);
      return;
    }

    charon.reply(text(0) + text(11));
    setMigrantQueue(country.chat, [...country.immigrantQueue, id]);
    setState(id, 'getpassport', null);

  } catch (e) {
    charon.reply(text(0) + text(7))
      .then(() => noState(charon));
    setState(id, 'getpassport', null);
  }
};

module.exports = choosingCountryToLive;
