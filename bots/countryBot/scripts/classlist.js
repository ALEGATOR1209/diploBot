'use strict';

const getAllClasses = require('./getAllClasses');
const findUser = require('./findUser');

const classlist = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const userCountry = findUser(tag);

  if (!userCountry) {
    ctx.reply('You\'re stateless!');
    return;
  }

  const classList = Object.keys(getAllClasses(userCountry.chat));
  ctx.reply(
    `All classes of ${userCountry.name}:\n\n` +
    classList.join('\n')
  );
};

module.exports = classlist;
