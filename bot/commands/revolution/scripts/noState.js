'use strict';

const revolution = charon => {
  const {
    getAdmins,
    findUser,
    getText,
    getRevolutionDemands,
    setState,
    getGame,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getText',
    'getRevolutionDemands',
    'setState',
    'getGame',
  ]);
  const text = t => getText('revolution')[t];

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

  const inPrison = country.citizens[id].inPrison;
  if (inPrison) {
    charon.reply(text(0) + text(3));
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(4) + country.name);
    return;
  }

  const REVOLUTION_DEMANDS = getRevolutionDemands();
  const types = Object.values(REVOLUTION_DEMANDS);
  types.push(text(5));
  charon.reply(
    text(0) + text(6),
    { buttons: types }
  );
  setState(id, 'revolution', 'choosingType');
};

module.exports = revolution;
