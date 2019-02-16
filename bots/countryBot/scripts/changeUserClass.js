'use strict';

const getStates = require('./getStates');
const setState = require('./setState');
const findUser = require('./findUser');
const getText = id => require('./getText')(`changeUserClass.${id}`);
const editUser = require('./editUser');
const Markup = require('telegraf/markup');
const getAllClasses = require('./getAllClasses');

const changeUserClass = ctx => {
  const reply = (text, options) => ctx.reply(
    text,
    Markup.removeKeyboard(true).extra(),
    options
  );
  const { username, id } = ctx.message.from;
  const userCountry = findUser(username) || findUser(id);
  const slave = getStates(id).changingUserClass;
  const slaveCountry = findUser(slave);
  const newClass = ctx.message.text
    .trim();

  if (!slaveCountry || slaveCountry.chat !== userCountry.chat) {
    reply(getText(1));
    return;
  }
  if (!getAllClasses(userCountry.chat)[newClass]) {
    reply(getText(2));
  }

  editUser(userCountry.chat, slave, { class: newClass });
  setState(id, 'changingUserClass', null);
  reply(getText(3));
  ctx.reply(
    `@${slave} ${getText(4)} ${newClass}`,
    { chat_id: `@${slaveCountry.chat}` }
  );
};

module.exports = changeUserClass;
