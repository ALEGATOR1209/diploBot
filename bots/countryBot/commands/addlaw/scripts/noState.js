'use strict';

const noState = charon => {
  const {
    getAdmins,
    findUser,
    getText,
    setState,
    getGame,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getText',
    'setState',
    'getGame',
  ]);
  const text = t => getText('addlaw')[t];
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
    charon.reply(text(0) + text(12));
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('ADOPTING_LAWS')) {
    charon.reply(text(0) + text(3));
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(4));
    return;
  }

  setState(id, 'addlaw', 'enteringLaw');
  charon.reply(text(0) + text(5));
};

module.exports = noState;
