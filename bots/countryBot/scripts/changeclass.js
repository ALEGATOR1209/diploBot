'use strict';

const getText = id => require('./getText')('changeclass')[id];
const getAdmins = require('./getAdmins');
const getAllClasses = require('./getAllClasses');
const findUser = require('./findUser');
const setState = require('./setState');
const Markup = require('telegraf/markup');

const isParent = (parent, child, classlist) => child.parentClass === parent ? true :
  child.parentClass ? isParent(parent, classlist[child.parentClass]) : false;
const getChildClasses = (className, classlist) => Object.keys(classlist)
    .filter(cls => isParent(className, classlist[cls], classlist));

const changeclass = ctx => {
  const { username, id } = ctx.message.from;
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(getText(1));
    return;
  }
  const country = findUser(username) || findUser(id);
  if (!country) {
    ctx.reply(getText(2));
    return;
  }
  const classlist = getAllClasses(country.chat);
  let userClass;
  if (username)
    userClass = country.citizens[username].class;
  else userClass = country.citizens[id].class;

  const childClasses = getChildClasses(userClass, classlist);
  if (!childClasses) {
    ctx.reply(getText(3));
    return;
  }

  let slave = ctx.message.text
    .match(/ *$/g)[0];
  if (slave) slave.trim();
  if (slave[0] === '@') slave = slave.slice(1);
  if (!slave) slave = username || id;

  const slaveCountry = findUser(slave);
  if (!slaveCountry || slaveCountry.chat !== country.chat) {
    ctx.reply(getText(4));
    return;
  }

  const slaveClass = slaveCountry.citizens[slave].class;
  if (!childClasses.find(x => x === slaveClass) && slaveClass !== 'default') {
    ctx.reply(getText(5));
    return;
  }

  ctx.reply(getText(6), Markup.keyboard(childClasses)
    .oneTime()
    .resize()
    .extra());

  setState(id, 'changingUserClass', slave);
};

module.exports = changeclass;
