'use strict';

const getAdmins = require('./getAdmins');
const getCountry = require('./getCountry');
const findUser = require('./findUser');
const setState = require('./setState');
const getText = text => require('./getText')(`addclass.${text}`);

const addclass = ctx => {
  const { username: uTag, id: uId } = ctx.message.from;
  const { username: cTag, id: cId } = ctx.message.chat;
  const reply = { reply_to_message_id: ctx.message.message_id };

  const country = getCountry(cTag) || getCountry(cId);
  const userCountry = findUser(uTag) || findUser(uId);

  if (getAdmins().includes(uTag) || getAdmins().includes(uId)) {
    ctx.reply(getText(1), reply);
    return;
  }

  if (!userCountry) {
    ctx.reply(getText(2), reply);
    return;
  }

  if (country && country.chat !== userCountry.chat) {
    ctx.reply(getText(3), reply);
    return;
  }

  if (
    !userCountry.classes[
      userCountry.citizens[uTag].class
    ].rights.includes('Право на назначение должностей')
  ) {
    ctx.reply(getText(4));
    return;
  }

  if (!country && ctx.message.chat.type !== 'private') return;

  ctx.reply(getText(5), reply);
  setState(uId, 'creatingClass', 'enteringName');
};

module.exports = addclass;
