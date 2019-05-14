'use strict';

const {
  getAdmins,
  getGame,
  findUser,
  setState,
  getText,
  getDead,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getGame',
    'getText',
    'findUser',
    'setState',
    'getDead',
  ]);
const text = t => getText('addclass')[t];

const noState = ctx => {
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(id)) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  const country = findUser(id);
  if (getDead(id)) {
    ctx.reply(text(0) + text(7), reply);
    return;
  }
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(6), reply);
    return;
  }

  if (country.citizens[id].inPrison) {
    ctx.reply(text(0) + text(5), reply);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('CREATING_CLASS')) {
    ctx.reply(text(0) + text(3));
    return;
  }

  ctx.reply(text(0) + text(4), reply);
  setState(id, 'addclass', 'enteringName');
};

module.exports = noState;
