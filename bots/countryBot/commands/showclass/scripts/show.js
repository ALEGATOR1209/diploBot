'use strict';

const show = charon => {
  const {
    getAllClasses,
    findUser,
    rightsString,
    getText,
    setState,
  } = charon.get([
    'getAllClasses',
    'findUser',
    'rightsString',
    'getText',
    'setState',
  ]);
  const text = t => getText('showclass')[t];

  const { text: messageText } = charon.message;
  const { id } = charon.message.from;

  const userCountry = findUser(id);
  if (!userCountry) {
    charon.reply(text(0) + text(1));
    setState(id, 'showclass', null);
    return;
  }

  const classList = getAllClasses(userCountry.chat);

  const className = messageText
    .trim();

  if (!className) {
    charon.reply(text(0) + text(3));
    setState(id, 'showclass', null);
    return;
  }

  const userClass = classList[className];
  if (!userClass || userClass.creator) {
    charon.reply(text(0) + text(4));
    setState(id, 'showclass', null);
    return;
  }
  const number = Object.keys(userCountry.citizens)
    .filter(man => userCountry.citizens[man].class === className).length;
  charon.reply(
    text(5) + className + '\n' +
    (userClass.parentClass ? `${text(6)}: ${userClass.parentClass}\n` : '') +
    rightsString(userClass.rights) + text(7) + ': ' +
    (userClass.number ?
      `${userClass.number}\n` : `${text(8)}\n`
    ) +
    `${text(9)}: ${number}` +
    (userClass.number && number >= userClass.number ? text(10) : '')
  );
  setState(id, 'showclass', null);
};

module.exports = show;
