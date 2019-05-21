'use strict';

const rights = charon => {
  const {
    rightsString,
    getText,
    findUser,
    getDead,
    getPlayers,
  } = charon.get([
    'rightsString',
    'getText',
    'findUser',
    'getDead',
    'getPlayers',
  ]);
  const text = t => getText('rights')[t];

  const { mentions } = charon;
  if (!mentions.length) {
    charon.reply(text(12));
    return;
  }
  for (const person of mentions) {
    const { username: pTag, id: pId } = person;
    if (getDead(pId)) {
      charon.reply(text(8));
      return;
    }

    const country = findUser(pId);
    if (!country) {
      charon.reply(text(9).replace('{user}', `@${pTag}`),);
      return;
    }

    const user = country.citizens[pId];
    if (!user) {
      charon.reply(`${text(3)} ${country.name}.`);
      return;
    }

    const userClassName = country.citizens[pId].class;
    const userClass = country.classes[user.class];
    charon.reply(
      text(1).replace('{user}', `@${pTag}`) +
      rightsString(userClass.rights) + '\n' +
      (user.inPrison ? text(4) : text(5)) +
      text(6) + userClassName + text(7) + country.name +
      (pId === charon.message.from.username ? text(10) : ''),
    );
  }
};

module.exports = rights;
