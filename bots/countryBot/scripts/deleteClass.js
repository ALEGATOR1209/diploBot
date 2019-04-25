'use strict';

const Extra = require('telegraf/extra');
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

  if (ctx.message.text.match(
    new RegExp(`^${getText('deleteclass')[6]}$`, 'gi')
  )) {
    ctx.reply(
      text(0) + text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'deletingClass', null);
    return;
  }

  if (!country) {
    ctx.reply(
      text(0) + text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'deletingClass', null);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      text(0) + text(8),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'deletingClass', null);
    return;
  }

  if (country.citizens[tag].inPrison) {
    ctx.reply(
      text(0) + text(3),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
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
    ctx.reply(
      text(0) + text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'deletingClass', null);
    return;
  }

  const classToDelete = ctx.message.text;
  if (!emptyClasses.includes(classToDelete)) {
    ctx.reply(
      text(0) + text(5),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'deletingClass', null);
    return;
  }

  removeClass(country.chat, classToDelete);
  setState(id, 'deletingClass', null);
  ctx.reply(
    text(6) + classToDelete + text(7),
    Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
  );
  if (ctx.message.chat.username !== country.chat) {
    ctx.reply(
      text(6) + classToDelete + text(7),
      { chat_id: `@${country.chat}` }
    );
  }
};

module.exports = deleteClass;
