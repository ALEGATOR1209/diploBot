'use strict';

const noState = charon => {
  const {
    findUser,
    getText,
    getCountry,
    setState,
  } = charon.get([
    'findUser',
    'getText',
    'getCountry',
    'setState',
  ]);
  const text = t => getText('showlaw')[t];

  const { id } = charon.message.from;
  let country;
  if (charon.message.chat.type === 'private') {
    country = findUser(id);
    if (!country) {
      charon.reply(text(0) + text(1));
      return;
    }
  } else if (getCountry(charon.message.chat.username)) {
    country = getCountry(charon.message.chat.username);
  } else {
    charon.reply(text(0) + text(1));
    return;
  }

  const lawlist = country.laws;
  const list = Object.keys(lawlist)
    .filter(law => !law.WIP);
  if (list.length < 1) {
    charon.reply(text(0) + text(2));
    return;
  }

  charon.reply(
    text(0) + text(8).replace('{country}', country.name),
    { buttons: [...list, text(6)] }
  );
  setState(id, 'showlaw', country.chat);
};

module.exports = noState;
