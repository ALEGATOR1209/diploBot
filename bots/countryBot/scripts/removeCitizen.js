'use strict';

const getCountry = require('./getCountry');
const getAdmins = require('./getAdmins');
const checkUserCountry = require('./checkUserCountry');
const retakePassport = require('./retakePassport');
const getText = id => require('./getText')(`removeCitizen.${id}`);

const removeCitizen = ctx => {
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  const { left_chat_member: user } = ctx.message;
  if (user.is_bot) return;

  const { username: tag, id: userId } = user;
  if (getAdmins().includes(tag)) {
    ctx.reply(`${getText(1)} @${tag}${getText(2)}`);
    return;
  }

  const nation = country.name;
  if (tag) {
    if (checkUserCountry(tag) && checkUserCountry(tag).chat === country.chat) {
      retakePassport(country, tag);
      ctx.reply(`@${tag} ${getText(3)} ${nation}.`);
      return;
    }
    ctx.reply(`${getText(4)} ${nation}.`);
    return;
  }
  if (checkUserCountry(userId).chat === country.chat) {
    retakePassport(country, userId);
    ctx.reply(`${user.first_name} ${getText(3)} ${nation}.`);
    return;
  }

  ctx.reply(`${getText(4)} ${nation}.`);
};

module.exports = removeCitizen;
