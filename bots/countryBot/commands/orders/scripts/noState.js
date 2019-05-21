'use strict';

const noState = charon => {
  const {
    getAdmins,
    getAllCountries,
    getAdminsChat,
    setState,
    getText,
  } = charon.get([
    'getAdmins',
    'getAllCountries',
    'getAdminsChat',
    'setState',
    'getText',
  ]);
  const text = t => getText('orders')[t];

  const { id } = charon.message.from;
  if (!getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }
  const rightChat = charon.message.chat.id === getAdminsChat() ||
    (
      charon.message.chat.type === 'private' &&
      getAdmins().includes(charon.message.chat.id)
    );
  if (!rightChat) {
    charon.reply(text(2));
    return;
  }

  const countries = getAllCountries();
  const list = Object.keys(countries)
    .map(country => countries[country].name);
  if (list.length < 1) {
    charon.reply(text(3));
    return;
  }

  charon.reply(
    text(4),
    { buttons: list }
  );
  setState(id, 'orders', 'choosingCountry');
};

module.exports = noState;
