'use strict';

const confirmation = charon => {
  const {
    getAdmins,
    findUser,
    getText,
    setState,
    setLaw,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getText',
    'setState',
    'setLaw',
  ]);
  const text = t => getText('addlaw')[t];
  const { id } = charon.message.from;
  if (getAdmins().includes(id)) {
    charon.reply(text(0) + text);
    setState(id, 'addingLaw', null);
    return;
  }

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    setState(id, 'addingLaw', null);
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(12));
    setState(id, 'addingLaw', null);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('ADOPTING_LAWS')) {
    charon.reply(text(0) + text(3));
    setState(id, 'addingLaw', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(4));
    setState(id, 'addingLaw', null);
    return;
  }

  const messageText = charon.message.text;
  const lawName = Object.keys(country.laws)
    .find(law => country.laws[law].WIP === id);
  const law = country.laws[lawName];

  if (messageText === text(6)) {
    charon.reply(text(0) + text(9));
    setState(id, 'addingLaw', null);
    law.WIP = undefined;
    setLaw(country.chat, lawName, law);
    return;
  }

  if (messageText === text(7)) {
    charon.reply(text(0) + text(10));
    setState(id, 'addingLaw', null);
    setLaw(country.chat, lawName, null);
    return;
  }

  charon.reply(text(0) + text(10));
};

module.exports = confirmation;
