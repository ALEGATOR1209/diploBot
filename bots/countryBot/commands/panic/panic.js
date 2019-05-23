'use strict';

const panic = charon => {
  const {
    getStates,
    setState,
    getText,
    findUser,
    removeClass,
  } = charon.get([
    'getStates',
    'setState',
    'getText',
    'findUser',
    'removeClass',
  ]);
  const text = t => getText('panic')[t];

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
