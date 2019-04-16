'use strict';

const getAllClasses = require('./getAllClasses');
const findUser = require('./findUser');
const getText = text => require('./getText')(`classlist.${text}`);
const {
  getAllClasses,
  findUser,
  getText
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAllClasses',
    'findUser',
    'getText'
  ]);
const text = t => getText('addclass')[t];

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
    `${getText(2)} ${userCountry.name}:\n\n` +
    classList.join('\n')
  );
};

module.exports = classlist;
