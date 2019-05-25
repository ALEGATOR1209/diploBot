'use strict';

const enteringNumber = charon => {
  const {
    setState,
    findUser,
    newClass,
    getText,
    rightsString,
    getDead,
  } = charon.get([
    'setState',
    'findUser',
    'newClass',
    'getText',
    'rightsString',
    'getDead',
  ]);
  const text = t => getText('addclass')[t];

  const { id } = charon.message.from;
  if (getDead(id)) {
    charon.reply(text(0) + text(7));
    setState(id, 'addclass', null);
    return;
  }
  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    setState(id, 'addclass', null);
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(6));
    setState(id, 'addclass', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(5));
    setState(id, 'addclass', null);
    return;
  }

  const number = Math.abs(parseInt(charon.message.text));
  if (number !== 0 && !number) {
    charon.reply(text(0) + text(8));
    return;
  }

  const userClassName = Object.keys(country.classes)
    .find(cl => country.classes[cl].creator === id);
  const userClass = country.classes[userClassName];
  userClass.number = number;
  newClass(country.chat, userClassName, userClass);
  charon.reply(
    text(0) +
    text(19) + userClassName +
    text(14) +
    rightsString(userClass.rights) +
    text(15) + (number === 0 ? '∞' : number) +
    text(16),
    { buttons: [text(17), text(18)] }
  );
  setState(id, 'addclass', 'confirmation');
};

module.exports = enteringNumber;
