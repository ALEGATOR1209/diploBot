'use strict';

const {
  getCountry,
  getAdmins,
  findUser,
  retakePassport,
  getText
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getCountry',
    'getAdmins',
    'findUser',
    'retakePassport',
    'getText',
  ]);
const text = t => getText('removeCitizen')[t];

const removeCitizen = ctx => {
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  const { left_chat_member: user } = ctx.message;
  if (user.is_bot) return;

  const { username: tag, id: userId } = user;
  if (getAdmins().includes(tag)) {
    ctx.reply(`${text(1)} @${tag}${text(2)}`);
    return;
  }

  const nation = country.name;
  if (tag) {
    if (findUser(tag) && findUser(tag).chat === country.chat) {
      retakePassport(country, tag);
      ctx.reply(`@${tag} ${text(3)} ${nation}.`);
      return;
    }
    ctx.reply(`${text(4)} ${nation}.`);
    return;
  }
  if (findUser(userId).chat === country.chat) {
    retakePassport(country, userId);
    ctx.reply(`${user.first_name} ${text(3)} ${nation}.`);
    return;
  }

  ctx.reply(`${text(4)} ${nation}.`);
};

module.exports = removeCitizen;
