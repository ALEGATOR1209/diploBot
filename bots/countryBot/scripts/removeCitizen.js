'use strict';

const getCountry = require('./getCountry');
const getAdmins = require('./getAdmins');
const checkUserCountry = require('./checkUserCountry');
const retakePassport = require('./retakePassport');

const removeCitizen = ctx => {
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  const { left_chat_member: user } = ctx.message;
  if (user.is_bot) return;

  const { username: tag, id: userId } = user;
  if (getAdmins().includes(tag)) {
    ctx.reply(`Goodbye, @${tag}-senpai! ^_^`);
    return;
  }

  const nation = country.name;
  if (tag) {
    if (checkUserCountry(tag) && checkUserCountry(tag).chat === country.chat) {
      retakePassport(country, tag);
      ctx.reply(`@${tag} is no longer a citizen of ${nation}.`);
      return;
    }
    ctx.reply(`Don't worry. This guy wasn't a citizen of ${nation}.`);
    return;
  }
  if (checkUserCountry(userId).chat === country.chat) {
    retakePassport(country, userId);
    ctx.reply(`${user.first_name} is no longer a citizen of ${nation}.`);
    return;
  }

  ctx.reply(`Don't worry. This guy wasn't a citizen of ${nation}.`);
};

module.exports = removeCitizen;
