'use strict';

const migrantclass = charon => {
  const {
    getText,
    findUser,
    setState,
    getGame,
  } = charon.get([
    'getText',
    'findUser',
    'setState',
    'getGame',
  ]);
  const text = t => getText('migrantclass')[t];
  const { id } = charon.message.from;

  if (getGame('turn') === 0) {
    charon.reply(getText('0turnAlert'));
    return;
  }

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(1));
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(6));
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(3));
    return;
  }

  const userClass = country.citizens[id].class;
  const hasLawRights = country
    .classes[userClass]
    .rights
    .includes('ADOPTING_LAWS');
  if (!hasLawRights) {
    charon.reply(text(0) + text(2));
    return;
  }

  const classlist = Object.keys(country.classes)
    .filter(cl => !(country.classes[cl].number || country.migrantClass === cl));

  if (classlist.length < 1) {
    charon.reply(text(0) + text(11));
    return;
  }
  classlist.push(text(4));
  charon.reply(
    text(0) + text(5),
    { buttons: classlist }
  );

  setState(id, 'migrantclass', 'choosingClass');
};

module.exports = migrantclass;
