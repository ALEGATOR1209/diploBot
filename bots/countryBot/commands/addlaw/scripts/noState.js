'use strict';

const {
  getAdmins,
  findUser,
  getText,
  setState,
  getGame,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'setState',
    'getGame',
  ]);
const text = t => getText('addlaw')[t];

const noState = ctx => {
  const { id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }
  if (getAdmins().includes(id)) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  const country = findUser(id);
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(12), reply);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('ADOPTING_LAWS')) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }
  if (country.citizens[id].inPrison) {
    ctx.reply(text(0) + text(4), reply);
    return;
  }

  setState(id, 'addlaw', 'enteringLaw');
  ctx.reply(text(0) + text(5), reply);
};

module.exports = noState;
