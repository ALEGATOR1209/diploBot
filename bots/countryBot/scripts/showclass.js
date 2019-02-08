'use strict';

const getAllClasses = require('./getAllClasses');
const findUser = require('./findUser');
const getCountry = require('./getCountry');
const rightsString = require('./rightsString');
const getText = id => require('./getText')(`showclass.${id}`);

const showclass = ctx => {
  const { text, chat } = ctx.message;
  const { id, username } = ctx.message.from;
  let userCountry;

  if (chat.type === 'private') {
    userCountry = findUser(username) || findUser(id);
    if (!userCountry) {
      ctx.reply(getText(1));
      return;
    }
  } else userCountry = getCountry(chat.username) || getCountry(chat.id);
  if (!userCountry) return;

  const className = text
    .slice('/showclass'.length)
    .trim();

  if (!className) {
    ctx.reply(getText(2));
    return;
  }
  const classList = getAllClasses(userCountry.chat);
  const userClass = classList[className];
  if (!userClass || userClass.creator) {
    ctx.reply(getText(3));
    return;
  }
  const number = Object.keys(userCountry.citizens)
    .filter(man => userCountry.citizens[man].class === className).length;
  ctx.reply(
    getText(4) + className + '\n' +
    (userClass.parentClass ? `${getText(5)}: ${userClass.parentClass}\n` : '') +
    rightsString(userClass.rights) + getText(6) + ':' +
    (userClass.number ? `${userClass.number}\n` :
      `${getText(7)}\n`) +
    `${getText(8)}: ${number}`,
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = showclass;
