'use strict';

const {
  getAdmins,
  findUser,
  getText,
  setState,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'setState',
  ]);
const text = t => getText('addlaw')[t];

const addlaw = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(tag)) {
    ctx.reply(text(1), reply);
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(2), reply);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(text(3), reply);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(4), reply);
    return;
  }

  setState(id, 'addingLaw', 'enteringLaw');
  ctx.reply(text(5), reply);
};

module.exports = addlaw;
