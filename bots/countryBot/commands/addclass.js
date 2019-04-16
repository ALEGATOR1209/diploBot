'use strict';

const {
  getAdmins,
  getCountry,
  findUser,
  setState,
  getText
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getCountry',
    'getText',
    'findUser',
    'setState'
  ]);
const text = t => getText('addclass')[t];

const addclass = ctx => {
  const { username: uTag, id: uId } = ctx.message.from;
  const { username: cTag, id: cId } = ctx.message.chat;
  const reply = { reply_to_message_id: ctx.message.message_id };

  const country = getCountry(cTag) || getCountry(cId);
  const userCountry = findUser(uTag) || findUser(uId);

  if (getAdmins().includes(uTag) || getAdmins().includes(uId)) {
    ctx.reply(text(1), reply);
    return;
  }

  if (!userCountry) {
    ctx.reply(text(2), reply);
    return;
  }

  if (country && country.chat !== userCountry.chat) {
    ctx.reply(text(3), reply);
    return;
  }

  if (
    !userCountry.classes[
      userCountry.citizens[uTag].class
    ].rights.includes('Право на назначение должностей')
  ) {
    ctx.reply(text(4));
    return;
  }

  if (!country && ctx.message.chat.type !== 'private') return;

  ctx.reply(text(5), reply);
  setState(uId, 'creatingClass', 'enteringName');
};

module.exports = addclass;
