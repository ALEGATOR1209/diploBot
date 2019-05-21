'use strict';

const {
  getStates,
  setState,
  getText,
  findUser,
  removeClass,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getStates',
    'setState',
    'getText',
    'findUser',
    'removeClass',
  ]);
const text = t => getText('panic')[t];

const panic = charon => {
  const { id } = charon.message.from;
  const states = getStates(id);
  for (const state in states) {
    setState(id, state, null);
  }
  const country = findUser(id);

  //Cleaning unfinished classes
  if (country) {
    Object.keys(country.classes)
      .filter(cl => country.classes[cl].creator === id)
      .forEach(cl => removeClass(country.chat, cl));
  }

  charon.reply(text(1));
};

module.exports = panic;
