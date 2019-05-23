'use strict';

const deport = charon => {
  const {
    findUser,
    getText,
    getChildClasses,
    deportUser,
    getGame,
  } = charon.get([
    'findUser',
    'getText',
    'getChildClasses',
    'deportUser',
    'getGame',
  ]);
  const text = t => getText('deport')[t];
  const { id } = charon.message.from;
  const country = findUser(id);

  if (getGame('turn') === 0) {
    charon.reply(getText('0turnAlert'));
    return;
  }

  if (!country) {
    charon.reply(text(0) + text(1));
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(10));
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];

  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(7));
    return;
  }
  if (!userClass.rights.includes('BORDER_MANAGEMENT')) {
    charon.reply(text(0) + text(2));
    return;
  }

  const { mentions } = charon;
  if (!mentions.length) {
    charon.reply(text(0) + text(3));
    return;
  }
  for (const person of mentions) {
    const { id: targetId, username } = person;
    const targetCountry = findUser(targetId);
    if (!targetCountry || targetCountry.chat !== country.chat) {
      charon.reply(text(0) + text(4));
      return;
    }
    const targetClass = country.citizens[targetId].class;
    const childClasses = getChildClasses(
      targetClass, Object.keys(country.classes)
    );
    if (childClasses.includes(userClassName)) {
      charon.reply(text(0) + text(5));
      return;
    }

    if (country.citizens[targetId].inPrison) {
      charon.reply(text(0) + text(9));
      return;
    }

    deportUser(country.chat, targetId);
    charon.reply(
      `${text(0)}${text(8)}` +
      `@${username} ${text(6)} ${country.name}`
    );

    if (charon.message.chat.username !== country.chat) {
      charon.reply(
        `${text(8)} @${username} ${text(6)} ${country.name}`,
        { chat_id: `@${country.chat}` }
      );
    }
  }
};

module.exports = deport;
