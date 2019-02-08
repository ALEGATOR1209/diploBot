'use strict';

const getAdmins = require('./getAdmins');
const getCountry = require('./getCountry');
const findUser = require('./findUser');
const setState = require('./setState');

const addclass = ctx => {
  const { username: uTag, id: uId } = ctx.message.from;
  const { username: cTag, id: cId } = ctx.message.chat;
  const reply = { reply_to_message_id: ctx.message.message_id };

  const country = getCountry(cTag) || getCountry(cId);
  const userCountry = findUser(uTag) || findUser(uId);

  if (getAdmins().includes(uTag) || getAdmins().includes(uId)) {
    ctx.reply(
      'Admins can\'t create social imparity. They must fix it!',
      reply
    );
    return;
  }

  if (!userCountry) {
    ctx.reply('It looks like you\'re stateless!', reply);
    return;
  }

  if (country && country.chat !== userCountry.chat) {
    ctx.reply(
      'Create classes only in your country chat or in private messages.',
      reply
    );
    return;
  }

  if (
    !userCountry.classes[
      userCountry.citizens[uTag].class
    ].rights.includes('Право на назначение должностей')
  ) {
    ctx.reply('You have no rights to create classes.');
    return;
  }

  if (!country && ctx.message.chat.type !== 'private') return;

  ctx.reply(
    'Ok, send me name of your class, please.' +
      '\nType cancel to abort.',
    reply
  );
  setState(uId, 'creatingClass', 'enteringName');
};

module.exports = addclass;
