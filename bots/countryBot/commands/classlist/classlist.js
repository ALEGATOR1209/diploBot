'use strict';

const {
  getAllClasses,
  findUser,
  getText,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAllClasses',
    'findUser',
    'getText',
  ]);
const text = t => getText('classlist')[t];

const classlist = ctx => {
  const { id } = ctx.message.from;
  const userCountry = findUser(id);

  if (!userCountry) {
    ctx.reply(text(1));
    return;
  }

  const classList = Object.keys(getAllClasses(userCountry.chat));
  ctx.reply(
    `${text(2)} ${userCountry.name}:\n\n` + text(3) +
    classList.join('\n' + text(3)),
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = classlist;
