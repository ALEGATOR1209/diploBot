'use strict';

const getCountry = require('./getCountry');
const getAdmins = require('./getAdmins');

const newCitizens = ctx => {
  const { username, id } = ctx.message.chat;
  const country = getCountry(username) || getCountry(id);
  if (!country) return;

  const { new_chat_members } = ctx.message;
  new_chat_members.forEach(user => {
    if (user.is_bot) return;

    const { username, id } = user;
    if (getAdmins().includes(username)) {
      ctx.reply(`Welcome in ${country.name}, @${username}-senpai! ^_^`);
      return;
    }

    if (username)
      ctx.reply(`Welcome in ${country.name}, @${username}!`);
    else ctx.reply(`Welcome in ${country.name}, ${user.first_name}!`);
  });
};

module.exports = newCitizens;
