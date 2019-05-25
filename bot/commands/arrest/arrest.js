'use strict';

const arrest = charon => {
  const {
    getAdmins,
    findUser,
    getGame,
    getText,
    jail,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getGame',
    'getText',
    'jail',
  ]);
  const text = t => getText('arrest')[t];
  const { id } = charon.message.from;

  if (getGame('turn') === 0) {
    charon.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(id)) {
    charon.reply(text(0) + text(1));
    return;
  }

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(10));
    return;
  }
  const userClass = country.citizens[id].class;
  if (!country.classes[userClass].rights.includes('ARREST_AND_RELEASE')) {
    charon.reply(text(0) + text(3));
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(9));
    return;
  }

  const { mentions } = charon;
  if (!mentions) {
    charon.reply(text(0) + text(4));
    return;
  }
  for (const target of charon.mentions) {
    const targetCountry = findUser(target.id);
    if (!targetCountry || targetCountry.chat !== country.chat) {
      charon.reply(text(0) + text(5) + country.name);
      continue;
    }
    if (country.citizens[target.id].inPrison) {
      charon.reply(text(8));
      continue;
    }

    if (charon.message.chat.username !== country.chat) {
      charon.reply(text(0) + text(6).replace('{username}', target.username));
    }
    jail(country.chat, target.id, true);
    if (target.id === id) {
      charon.reply(
        text(12) + `@${target.username} ` + text(11),
        null,
        { chat_id: `@${country.chat}` }
      );
    } else {
      charon.reply(
        `@${target.username}` + text(7),
        null,
        { chat_id: `@${country.chat}` }
      );
    }
  }
};

module.exports = arrest;
