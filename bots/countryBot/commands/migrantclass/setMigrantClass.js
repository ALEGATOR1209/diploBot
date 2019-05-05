'use strict';

const Extra = require('telegraf/extra');
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
const infoText = getText('migrantclass')[0];

const setMigrantClass = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (ctx.message.text.match(new RegExp(`^${text(4)}$`, 'gi'))) {
    ctx.reply(
      infoText +
      text(7),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'settingMigrantClass', null);
    return;
  }

  if (!country) {
    ctx.reply(
      infoText +
      text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'settingMigrantClass', null);
    return;
  }

  if (country.citizens[tag].inPrison) {
    ctx.reply(
      infoText +
      text(8),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'settingMigrantClass', null);
    return;
  }

  const userClass = country.citizens[tag].class;
  const hasLawRights = country
    .classes[userClass]
    .rights
    .includes('Право на принятие законов');
  if (!hasLawRights) {
    ctx.reply(
      infoText +
      text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'settingMigrantClass', null);
    return;
  }

  const classlist = getAllClasses(country.chat);
  const childClasses = getChildClasses(userClass, classlist);
  if (childClasses.length < 1) {
    ctx.reply(
      infoText +
      text(3),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'settingMigrantClass', null);
    return;
  }
  const migrantClass = ctx.message.text;
  if (!childClasses.includes(migrantClass)) {
    ctx.reply(
      infoText +
      text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'settingMigrantClass', null);
    return;
  }
  if (
    !country.classes[migrantClass] ||
    country.classes[migrantClass].number !== 0
  ) {
    ctx.reply(
      infoText +
      text(9),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'settingMigrantClass', null);
    return;
  }

  setMigrationClass(country.chat, migrantClass);
  ctx.reply(
    infoText +
    text(5) + migrantClass + text(6),
    Extra
      .load(reply)
      .HTML()
      .markup(Markup.removeKeyboard(true).selective(true))
  );

  if (country.chat !== ctx.message.chat.username) {
    ctx.reply(
      infoText +
      text(5) + migrantClass + text(6),
      Extra
        .load({ chat_id: `@${country.chat}` })
        .HTML()
        .markup(Markup.removeKeyboard(true).selective(true))
    );
  }
  setState(id, 'settingMigrantClass', null);
};

module.exports = setMigrantClass;
