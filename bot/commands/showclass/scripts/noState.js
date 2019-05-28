'use strict';

const noState = charon => {
  const {
    getAllClasses,
    findUser,
    getText,
    setState,
  } = charon.get([
    'getAllClasses',
    'findUser',
    'getText',
    'setState',
  ]);
  const text = t => getText('showclass')[t];
  const { id } = charon.message.from;

  const userCountry = findUser(id);
  if (!userCountry) {
    charon.reply(text(0) + text(1));
    return;
  }

  const classList = getAllClasses(userCountry.chat);
  charon.reply(
    text(0) +
    text(2),
    { buttons: Object.keys(classList) }
  );
  setState(id, 'showclass', 'show');
};

module.exports = noState;
