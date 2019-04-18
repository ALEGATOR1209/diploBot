'use strict';

const Markup = require('telegraf/markup');
const {
  getText,
  findUser,
  getChildClasses,
  getAllClasses,
  setState,
  setMigrationClass,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'findUser',
    'getChildClasses',
    'getAllClasses',
    'setState',
    'setMigrationClass',
  ]);
const text = t => getText('setMigrantClass')[t];

const setMigrantClass = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (ctx.message.text.match(/^cancel$/i)) {
    ctx.reply(text(7));
    setState(id, 'settingMigrantClass', null);
    return;
  }

  if (!country) {
    ctx.reply(text(1), reply);
    setState(id, 'settingMigrantClass', null);
    return;
  }

  const userClass = country.citizens[tag].class;
  const hasLawRights = country
    .classes[userClass]
    .rights
    .includes('Право на принятие законов');
  if (!hasLawRights) {
    ctx.reply(text(2), reply);
    setState(id, 'settingMigrantClass', null);
    return;
  }

  const classlist = getAllClasses(country.chat);
  const childClasses = getChildClasses(userClass, classlist);
  if (childClasses.length < 1) {
    ctx.reply(text(3), reply);
    setState(id, 'settingMigrantClass', null);
    return;
  }
  const migrantClass = ctx.message.text;
  if (!childClasses.includes(migrantClass)) {
    ctx.reply(4, reply);
    setState(id, 'settingMigrantClass', null);
    return;
  }

  setMigrationClass(country.chat, migrantClass);
  ctx.reply(
    text(5) + migrantClass + text(6),
    Markup.removeKeyboard(true).extra(),
    reply
  );

  setState(id, 'settingMigrantClass', null);
};

module.exports = setMigrantClass;
