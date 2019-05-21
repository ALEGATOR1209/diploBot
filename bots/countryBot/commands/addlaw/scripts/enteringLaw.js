'use strict';

const enteringLaw = charon => {
  const {
    getAdmins,
    findUser,
    getText,
    setState,
    getTurn,
    setLaw,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getText',
    'setState',
    'getTurn',
    'setLaw',
  ]);
  const text = t => getText('addlaw')[t];
  const { id } = charon.message.from;

  if (getAdmins().includes(id)) {
    charon.reply(text(0) + text(1));
    setState(id, 'addlaw', null);
    return;
  }

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    setState(id, 'addlaw', null);
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(12));
    setState(id, 'addlaw', null);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('ADOPTING_LAWS')) {
    charon.reply(text(0) + text(3));
    setState(id, 'addlaw', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(4));
    setState(id, 'addlaw', null);
    return;
  }

  const law = charon.message.text
    .split('\n')
    .filter(s => s.length > 0);
  if (law.length < 2) {
    charon.reply(text(0) + text(8));
    setState(id, 'addlaw', null);
    return;
  }
  const lawName = law.shift();
  if (lawName.match(/\./gi)) {
    charon.reply(text(0) + text(13));
    return;
  }
  const lawText = law.join('\n');
  setLaw(country.chat, lawName, {
    text: lawText,
    date: getTurn(),
    WIP: id,
  });
  setState(id, 'addlaw', 'confirmation');
  charon.reply(
    text(0) + text(11),
    { buttons: [text(6), text(7)] }
  );
};

module.exports = enteringLaw;
