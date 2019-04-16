'use strict';

const {
  getCountry,
  getAdmins,
  givePassport,
  findUser,
  getText,
  getDead,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getCountry',
    'getAdmins',
    'givePassport',
    'findUser',
    'getText',
    'getDead',
  ]);
const text = t => getText('addclass')[t];

const newCitizens = ctx => {
  const { username: countryTag, id: countryId } = ctx.message.chat;
  const country = getCountry(countryTag) || getCountry(countryId);
  if (!country) return;

  const { new_chat_members } = ctx.message;
  new_chat_members.forEach(user => {
    if (user.is_bot) return;

    const { username: tag, id: userId } = user;
    if (getAdmins().includes(tag) || getAdmins().includes(userId)) {
      ctx.reply(`${text(1)} ${country.name}, @${tag}${text(2)}`);
      return;
    }

    if (getDead(userId) || getDead(tag)) {
      ctx.reply(text(7));
      return;
    }
    if (country.blacklist[userId] || country.blacklist[tag]) {
      ctx.reply(`@${tag} ${text(8)} ${country.name} ${text(9)}`);
      return;
    }

    const nation = country.name;
    if (tag) {
      ctx.reply(`${text(1)} ${nation}, @${tag}!`);
      if (findUser(tag)) {
        ctx.reply(`${text(3)} @${tag}!\n${text(4)}`);
        return;
      }
      givePassport(country, tag);
    } else {
      ctx.reply(`${text(1)} ${nation}, ${user.first_name}!`);
      if (findUser(userId)) {
        const { first_name, last_name } = ctx.message.from;
        const name = first_name + (last_name || '');
        ctx.reply(`${text(3)} ${name}!\n${text(4)}`);
        return;
      }
      givePassport(country, userId);
    }

    ctx.reply(`${text(5)} ${nation}.\n${text(6)}`);
  });
};

module.exports = newCitizens;
