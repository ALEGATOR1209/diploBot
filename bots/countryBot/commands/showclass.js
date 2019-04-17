'use strict';

const {
  getAllClasses,
  findUser,
  getCountry,
  rightsString,
  getText
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAllClasses',
    'findUser',
    'getCountry',
    'rightsString',
    'getText',
  ]);
const text = t => getText('showclass')[t];

const showclass = ctx => {
  const { text: messageText, chat } = ctx.message;
  const { id, username } = ctx.message.from;
  let userCountry;

  if (chat.type === 'private') {
    userCountry = findUser(username) || findUser(id);
    if (!userCountry) {
      ctx.reply(text(1));
      return;
    }
  } else userCountry = getCountry(chat.username) || getCountry(chat.id);
  if (!userCountry) return;

  const className = messageText
    .slice('/showclass'.length)
    .trim();

  if (!className) {
    ctx.reply(text(2));
    return;
  }
  const classList = getAllClasses(userCountry.chat);
  const userClass = classList[className];
  if (!userClass || userClass.creator) {
    ctx.reply(text(3));
    return;
  }
  const number = Object.keys(userCountry.citizens)
    .filter(man => userCountry.citizens[man].class === className).length;
  ctx.reply(
    text(4) + className + '\n' +
    (userClass.parentClass ? `${text(5)}: ${userClass.parentClass}\n` : '') +
    rightsString(userClass.rights) + text(6) + ': ' +
    (userClass.number ? `${userClass.number}\n` :
      `${text(7)}\n`) +
    `${text(8)}: ${number}`,
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = showclass;
