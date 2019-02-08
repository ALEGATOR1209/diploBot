'use strict';

const getAllClasses = require('./getAllClasses');
const findUser = require('./findUser');
const getCountry = require('./getCountry');
const rightsString = require('./rightsString');

const showclass = ctx => {
  const { text, chat } = ctx.message;
  const { id, username } = ctx.message.from;
  let userCountry;

  if (chat.type === 'private') {
    userCountry = findUser(username) || findUser(id);
    if (!userCountry) {
      ctx.reply('You\'re stateless!');
      return;
    }
  } else userCountry = getCountry(chat.username) || getCountry(chat.id);
  if (!userCountry) return;

  const className = text
    .slice('/showclass'.length)
    .trim();

  if (!className) {
    ctx.reply('Usage: /showclass classname');
    return;
  }
  const classList = getAllClasses(userCountry.chat);
  const userClass = classList[className];
  if (!userClass || userClass.creator) {
    ctx.reply('Class not found.');
    return;
  }
  const number = Object.keys(userCountry.citizens)
    .filter(man => userCountry.citizens[man].class === className).length;
  ctx.reply(
    `Класс ${className}\n` +
    (userClass.parentClass ? `Родительский класс: ${userClass.parentClass}\n` : '') +
    rightsString(userClass.rights) +
    (userClass.number ? `Максимальная численность: ${userClass.number}\n` :
      'Максимальная численность: неограничено\n') +
    `Текущая численность: ${number}`,
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = showclass;
