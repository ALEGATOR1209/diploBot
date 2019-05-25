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
  const text = t => getText('rmlaw')[t];

  if (getGame('turn') === 0) {
    charon.reply(getText('0turnAlert'));
    return;
  }
  const { id } = charon.message.from;
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
    charon.reply(text(0) + text(8));
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

  const lawlist = Object.keys(country.laws)
    .filter(law => !country.laws[law].WIP);
  if (lawlist.length < 1) {
    charon.reply(text(0) + text(7));
    return;
  }
  lawlist.push(text(6));
  setState(id, 'rmlaw', 'choosingLaw');
  charon.reply(
    text(0) +
    text(5),
    { buttons: lawlist }
  );
};

module.exports = noState;
