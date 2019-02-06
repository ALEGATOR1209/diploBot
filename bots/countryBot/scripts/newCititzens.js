'use strict';

const getCountry = require('./getCountry');
const getAdmins = require('./getAdmins');
const givePassport = require('./givePassport');
const checkUserCountry = require('./checkUserCountry');

const newCitizens = ctx => {
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  const { new_chat_members } = ctx.message;
  new_chat_members.forEach(user => {
    if (user.is_bot) return;

    const { username: tag, id: userId } = user;
    if (getAdmins().includes(tag)) {
      ctx.reply(`Welcome in ${country.name}, @${tag}-senpai! ^_^`);
      return;
    }

    const nation = country.name;
    if (tag) {
      ctx.reply(`Welcome in ${nation}, @${tag}!`);
      if (checkUserCountry(tag)) {
        ctx.reply(
          `It looks like you're sitizen of another country, @${tag}!\n` +
          'You cannot have full sitizen rigth here.'
        );
        return;
      }
      givePassport(country, tag);
    } else {
      ctx.reply(`Welcome in ${nation}, ${user.first_name}!`);
      if (checkUserCountry(userId)) {
        ctx.reply(
          `It looks like you're sitizen of another country, @${tag}!\n` +
          'You cannot have full sitizen rigth here.'
        );
        return;
      }
      givePassport(country, userId);
    }

    ctx.reply(
      `You are a citizen of ${nation} now. ` +
      'You have all posibilities in accord with local laws.'
    );
  });
};

module.exports = newCitizens;
