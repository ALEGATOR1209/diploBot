'use strict';

const free = async charon => {
  const {
    getAdmins,
    findUser,
    getText,
    jail,
    getGame,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getText',
    'jail',
    'getGame',
  ]);
  const text = t => getText('free')[t];
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

  const userClass = country.citizens[id].class;
  if (!country.classes[userClass].rights.includes('ARREST_AND_RELEASE')) {
    charon.reply(text(0) + text(3));
    return;
  }

  if (country.hasRevolution) {
    charon.reply(text(0) + text(9));
    const prisoners = Object.keys(country.citizens)
      .filter(man => country.citizens[man].inPrison);
    for (const person of prisoners) {
      if (Math.random() < 0.6) {
        const { username, id: prisonerId } = await charon.getChat(person);
        jail(country.chat, prisonerId, false);
        charon.reply(
          text(12) + text(13).replace('{user}', `@${username}`),
          null,
          { chat_id: `@${country.chat}` }
        );
      }
    }
  }

  const { mentions } = charon;
  if (!mentions.length) {
    charon.reply(text(0) + text(4));
    return;
  }
  for (const person of mentions) {
    const { id: targetId, username } = person;
    const targetCountry = findUser(targetId);
    if (!targetCountry || targetCountry.chat !== country.chat) {
      charon.reply(text(0) + text(5) + country.name);
      return;
    }
    if (!country.citizens[targetId].inPrison) {
      charon.reply(text(0) + text(8));
      return;
    }

    if (charon.message.chat.username !== country.chat)
      charon.reply(text(0) + text(6));
    jail(country.chat, targetId, false);
    if (targetId === id) {
      charon.reply(
        text(10) + username + text(11),
        null,
        { chat_id: `@${country.chat}` }
      );
    } else {
      charon.reply(
        `@${username}` + text(7),
        null,
        { chat_id: `@${country.chat}` }
      );
    }
  }
};

module.exports = free;
