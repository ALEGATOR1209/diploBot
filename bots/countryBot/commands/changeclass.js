'use strict';

const Markup = require('telegraf/markup');
const {
  getAdmins,
  getAllClasses,
  findUser,
  setState,
  getChildClasses,
  getText,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getAllClasses',
    'findUser',
    'setState',
    'getChildClasses'
  ]);
const text = t => getText('addclass')[t];

const changeclass = ctx => {
  const { username, id } = ctx.message.from;
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(text(1));
    return;
  }
  const country = findUser(username) || findUser(id);
  if (!country) {
    ctx.reply(text(2));
    return;
  }
  const classlist = getAllClasses(country.chat);
  let userClass;
  if (username)
    userClass = country.citizens[username].class;
  else userClass = country.citizens[id].class;

  const childClasses = getChildClasses(userClass, classlist);
  if (!childClasses) {
    ctx.reply(text(3));
    return;
  }

  let slave = ctx.message.text
    .match(/ *$/g)[0];
  if (slave) slave.trim();
  if (slave[0] === '@') slave = slave.slice(1);
  if (!slave) slave = username || id;

  const slaveCountry = findUser(slave);
  if (!slaveCountry || slaveCountry.chat !== country.chat) {
    ctx.reply(text(4));
    return;
  }

  const slaveClass = slaveCountry.citizens[slave].class;
  if (!childClasses.find(x => x === slaveClass) && slaveClass !== 'default') {
    ctx.reply(text(5));
    return;
  }

  ctx.reply(text(6), Markup.keyboard(childClasses)
    .oneTime()
    .resize()
    .extra());

  setState(id, 'changingUserClass', slave);
};

module.exports = changeclass;
