'use strict';

const arrest = charon => {
  const {
    getAdmins,
    findUser,
    getText,
    bury,
    getGame,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getText',
    'bury',
    'getGame',
  ]);
  const text = t => getText('execute')[t];
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
    charon.reply(text(0) + text(8));
    return;
  }

  const userClass = country.citizens[id].class;
  if (!country.classes[userClass].rights.includes('EXECUTION')) {
    charon.reply(text(0) + text(3));
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(10));
    return;
  }

  const { mentions } = charon;
  if (!mentions.length) {
    charon.reply(text(0) + text(4));
    return;
  }
  for (const person of mentions) {
    const { id: targetId, username } = person;
    const victimCountry = findUser(targetId);
    if (!victimCountry || victimCountry.chat !== country.chat) {
      charon.reply(text(0) + text(5) + country.name);
      return;
    }
    if (!country.citizens[targetId].inPrison) {
      charon.reply(text(0) + text(6));
      return;
    }

    charon.reply(text(0) + text(7));
    bury(targetId);
    if (charon.message.chat.username !== country.chat)
      charon.reply(
        `@${username}` + text('executions'),
        { chat_id: `@${country.chat}` }
      );
  }
};

module.exports = arrest;
