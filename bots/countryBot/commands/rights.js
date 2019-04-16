'use strict';

const getCountry = require('./getCountry');
const getAdmins = require('./getAdmins');
const rightsString = require('./rightsString');
const getText = id => require('./getText')(`rights.${id}`);
const findUser = require('./findUser');
const {
  getCountry,
  getAdmins,
  rightsString,
  getText,
  findUser,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getCountry',
    'getAdmins',
    'rightsString',
    'getText',
    'findUser',
  ]);
const text = t => getText('addclass')[t];


const rights = ctx => {
  let tag = ctx.message
    .text
    .match(/ .*$/);
  if (tag) tag = tag[0].trim().slice(1);
  else tag = ctx.message.from.username || ctx.message.from.id;

  const { username: link, id: countryId } = ctx.message.chat;
  const country = getCountry(link) || getCountry(countryId) || findUser(tag);
  if (!country) {
    return;
  }

  if (getAdmins().includes(tag)) {
    ctx.reply(
      `@${tag} ${getText(1)}:\n\n${getText(2)}`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const user = country.citizens[tag];
  if (!user) {
    ctx.reply(
      `${getText(3)} ${country.name}.`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const classlist = country.classes;
  const userClass = classlist[user.class];
  const userClassName = user.class;
  ctx.reply(
    `${getText(1)}:\n\n` +
    rightsString(userClass.rights) + '\n' +
    (user.inPrison ? getText(4) : getText(5)) +
    getText(6) + userClassName + getText(7) + country.name,
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = rights;
