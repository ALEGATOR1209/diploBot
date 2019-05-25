'use strict';

const dead = charon => {
  const {
    getAdmins,
    getText,
  } = charon.get([
    'getAdmins',
    'getText',
  ]);
  const checkDead = require('../turn/scripts/checkDead');
  const text = t => getText('dead')[t];

  const { id } = charon.message.from;
  if (!getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }
  charon.reply(text(2));
  checkDead(charon);
};

module.exports = dead;
