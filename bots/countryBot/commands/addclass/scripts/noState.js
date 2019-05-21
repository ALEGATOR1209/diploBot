'use strict';

const noState = charon => {
  const {
    getAdmins,
    getGame,
    findUser,
    setState,
    getText,
    getDead,
  } = charon.get(
    [
      'getAdmins',
      'getGame',
      'getText',
      'findUser',
      'setState',
      'getDead',
    ]);
  const text = t => getText('addclass')[t];

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
  if (getDead(id)) {
    charon.reply(text(0) + text(7));
    return;
  }
  if (!country) {
    charon.reply(text(0) + text(2));
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(6));
    return;
  }

  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(5));
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('CREATING_CLASS')) {
    charon.reply(text(0) + text(3));
    return;
  }

  charon.reply(text(0) + text(4));
  setState(id, 'addclass', 'enteringName');
};

module.exports = noState;
