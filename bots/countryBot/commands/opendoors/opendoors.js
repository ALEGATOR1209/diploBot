'use strict';

const opendoors = charon => {
  const {
    findUser,
    getText,
    getPlayers,
    unban,
  } = charon.get([
    'findUser',
    'getText',
    'getPlayers',
    'unban',
  ]);
  const text = t => getText('opendoors')[t];

  const { id } = charon.message.from;
  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(1));
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(10));
    return;
  }
  const userClass = country.classes[
    country
      .citizens[id]
      .class
  ];
  if (!userClass.rights.includes('BORDER_MANAGEMENT')) {
    charon.reply(text(0) + text(2));
    return;
  }

  const blacklist = country.blacklist;
  if (Object.keys(blacklist).length < 1) {
    charon.reply(text(0) + text(3));
    return;
  }

  const { mentions } = charon;
  if (!mentions.length) {
    charon.reply(text(0) + text(7));
    return;
  }
  for (const person of mentions) {
    const { id: targetId, username: targetTag } = person;
    if (blacklist[targetId] === undefined) {
      charon.reply(text(0) + text(12));
      return;
    }
    charon.reply(text(0) + text(8));
    if (country.chat !== charon.message.chat.username)
      charon.reply(
        text(0) + text(13)
          .replace('{player}', `@${targetTag}`),
        { chat_id: `@${country.chat}` }
      );
    unban(country.chat, targetId);

  }
};

module.exports = opendoors;
