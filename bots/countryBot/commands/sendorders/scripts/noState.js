'use strict';

const noState = charon => {
  const {
    getAdmins,
    findUser,
    getText,
    getDead,
    setState,
    getGame,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'setState',
    'getGame',
  ]);
  const text = t => getText('sendorders')[t];

  if (getGame('turn') === 0) {
    charon.reply(getText('0turnAlert'));
    return;
  }
  const { id } = charon.message.from;
  if (getAdmins().includes(id)) {
    charon.reply(text(0) + text(1));
    return;
  }

  if (getDead(id)) {
    charon.reply(text(0) + text(2));
    return;
  }
  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(3));
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('COMMAND_ARMIES')) {
    charon.reply(text(0) + text(4));
    return;
  }
  charon.reply(text(0) + text(5));
  setState(id, 'sendorders', country.chat);
};

module.exports = noState;
