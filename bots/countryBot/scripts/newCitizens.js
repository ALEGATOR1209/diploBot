'use strict';

const getCountry = require('./getCountry');
const getAdmins = require('./getAdmins');
const givePassport = require('./givePassport');
const findUser = require('./findUser');
const getText = id => require('./getText')(`newCitizens.${id}`);
const getDead = require('./getDead');

const newCitizens = ctx => {
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  const { new_chat_members } = ctx.message;
  new_chat_members.forEach(user => {
    if (user.is_bot) return;

    const { username: tag, id: userId } = user;
    if (getAdmins().includes(tag) || getAdmins().includes(userId)) {
      ctx.reply(`${getText(1)} ${country.name}, @${tag}${getText(2)}`);
      return;
    }

    if (getDead(userId) || getDead(tag)) {
      ctx.reply(getText(7));
      return;
    }
    if (country.blacklist[userId] || country.blacklist[tag]) {
      ctx.reply(`@${tag} ${getText(8)} ${country.name} ${getText(9)}`);
      return;
    }

    const nation = country.name;
    if (tag) {
      ctx.reply(`${getText(1)} ${nation}, @${tag}!`);
      if (findUser(tag)) {
        ctx.reply(`${getText(3)} @${tag}!\n${getText(4)}`);
        return;
      }
      givePassport(country, tag);
    } else {
      ctx.reply(`${getText(1)} ${nation}, ${user.first_name}!`);
      if (findUser(userId)) {
        const { first_name, last_name } = ctx.message.from;
        const name = first_name + (last_name || '');
        ctx.reply(`${getText(3)} ${name}!\n${getText(4)}`);
        return;
      }
      givePassport(country, userId);
    }

    ctx.reply(`${getText(5)} ${nation}.\n${getText(6)}`);
  });
};

module.exports = newCitizens;
