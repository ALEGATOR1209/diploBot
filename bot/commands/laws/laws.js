'use strict';

const laws = charon => {
  const {
    findUser,
    getText,
    getCountry,
  } = charon.get([
    'findUser',
    'getText',
    'getCountry',
  ]);
  const text = t => getText('laws')[t];

  const { id } = charon.message.from;
  let country;
  if (charon.message.chat.type === 'private') {
    country = findUser(id);
    if (!country) {
      charon.reply(text(1));
      return;
    }
  } else if (getCountry(charon.message.chat.username)) {
    country = getCountry(charon.message.chat.username);
  } else {
    charon.reply(text(1));
    return;
  }

  const lawlist = country.laws || {};
  const list = Object.keys(lawlist)
    .filter(law => !law.WIP);
  if (list.length < 1) {
    charon.reply(text(6));
    return;
  }
  let answer = text(2) + `<b>${country.name.toUpperCase()}</b>\n\n`;
  for (const law of list) {
    answer +=
      `${text(3)} ${law} ${text(3)}\n` +
      `${text(4)}${lawlist[law].date}${text(5)}\n\n`;
  }
  charon.reply(answer);
};

module.exports = laws;
