'use strict';

const {
  getAllClasses,
  findUser,
  getText,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAllClasses',
    'findUser',
    'getText',
  ]);
const text = t => getText('classlist')[t];

const classlist = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const userCountry = findUser(tag);

  if (!userCountry) {
    ctx.reply(text(1));
    return;
  }

  const classList = Object.keys(getAllClasses(userCountry.chat));
  ctx.reply(
    `${text(2)} ${userCountry.name}:\n\n` + text(3) +
    classList.join('\n' + text(3))
  );
};

module.exports = classlist;
