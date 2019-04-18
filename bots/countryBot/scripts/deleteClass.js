'use strict';

const Markup = require('telegraf/markup');
const {
  getText,
  findUser,
  setState,
  getChildClasses,
  getAllClasses,
  removeClass,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'findUser',
    'setState',
    'getChildClasses',
    'getAllClasses',
    'removeClass',
  ]);
const text = t => getText('deleteClass')[t];

const deleteClass = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const country = findUser(tag);

  if (!country) {
    ctx.reply(text(1), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'deletingClass', null);
    return;
  }

  const userClass = country.citizens[tag].class;
  const classlist = getAllClasses(country.chat);
  const childClasses = getChildClasses(userClass, classlist);

  const emptyClasses = childClasses.filter(classname => {
    for (const man in country.citizens) {
      if (country.citizens[man].class === classname) return false;
    }
    return true;
  });
  if (emptyClasses.length < 1) {
    ctx.reply(text(2), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'deletingClass', null);
    return;
  }

  const classToDelete = ctx.message.text;
  if (!emptyClasses.includes(classToDelete)) {
    ctx.reply(text(3), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'deletingClass', null);
    return;
  }

  removeClass(country.chat, classToDelete);
  setState(id, 'deletingClass', null);
  ctx.reply(
    text(4) + classToDelete + text(5),
    Markup.removeKeyboard(true).extra(),
    reply
  );
};

module.exports = deleteClass;
