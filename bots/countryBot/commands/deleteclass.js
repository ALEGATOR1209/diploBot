'use strict';

const Markup = require('telegraf/markup');
const {
  getAdmins,
  getText,
  findUser,
  getChildClasses,
  getAllClasses,
  setState,
  getMigrationClass,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getText',
    'findUser',
    'getChildClasses',
    'getAllClasses',
    'setState',
    'getMigrationClass',
  ]);
const text = t => getText('deleteclass')[t];

const deleteclass = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(text(1), reply);
    return;
  }

  const tag = username || id;
  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(2), reply);
    return;
  }
  const classlist = getAllClasses(country.chat);
  const userClass = country.citizens[tag].class;
  const childClasses = getChildClasses(userClass, classlist);
  if (childClasses.length < 1) {
    ctx.reply(text(4), reply);
    return;
  }
  let emptyClasses = childClasses.filter(classname => {
    for (const man in country.citizens) {
      if (country.citizens[man].class === classname) return false;
    }
    return true;
  });
  emptyClasses = emptyClasses
    .filter(cl =>
      getChildClasses(cl, classlist).length === 0 &&
      getMigrationClass(country.chat) !== cl
    );

  if (emptyClasses.length < 1) {
    ctx.reply(text(5), reply);
    return;
  }
  emptyClasses.push(text(7));
  ctx.reply(text(6), Markup.keyboard(emptyClasses)
    .oneTime()
    .resize()
    .extra());

  setState(id, 'deletingClass', 1);
};

module.exports = deleteclass;
