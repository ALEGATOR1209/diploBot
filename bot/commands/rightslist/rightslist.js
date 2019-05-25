'use strict';

const rightslist = charon => {
  const {
    getAllRights,
    getText
  } = charon.get([
    'getAllRights',
    'getText'
  ]);
  const text = id => getText('rightslist')[id];

  charon.reply(
    text(1) + text(2) + Object.keys(getAllRights)
      .map(right => getAllRights[right])
      .join(text(2)),
  );
};

module.exports = rightslist;
