'use strict';

const {
  getAdmins,
  getGame,
  findUser,
  setState,
  getText
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getGame',
    'getText',
    'findUser',
    'setState'
  ]);
const text = t => getText('addclass')[t];

const addclass = ctx => {
  const { username: uTag, id: uId } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };

  const userCountry = findUser(uTag) || findUser(uId);
  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(uTag) || getAdmins().includes(uId)) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  if (!userCountry) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  if (userCountry.hasRevolution) {
    ctx.reply(text(0) + text(6), reply);
    return;
  }

  const name = uTag || uId;
  if (userCountry.citizens[name].inPrison) {
    ctx.reply(text(0) + text(5), reply);
    return;
  }

  if (
    !userCountry.classes[
      userCountry.citizens[uTag].class
    ].rights.includes('Право на назначение должностей')
  ) {
    ctx.reply(text(0) + text(3));
    return;
  }

  ctx.reply(text(0) + text(4), reply);
  setState(uId, 'creatingClass', 'enteringName');
};

module.exports = addclass;
