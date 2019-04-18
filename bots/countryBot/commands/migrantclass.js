'use strict';

const Markup = require('telegraf/markup');
const {
  getText,
  findUser,
  getChildClasses,
  getAllClasses,
  setState,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'findUser',
    'getChildClasses',
    'getAllClasses',
    'setState',
  ]);
const text = t => getText('migrantclass')[t];

const migrantclass = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (!country) {
    ctx.reply(text(1), reply);
    return;
  }

  const userClass = country.citizens[tag].class;
  const hasLawRights = country
    .classes[userClass]
    .rights
    .includes('Право на принятие законов');
  if (!hasLawRights) {
    ctx.reply(text(2), reply);
    return;
  }

  const classlist = getAllClasses(country.chat);
  const childClasses = getChildClasses(userClass, classlist);
  if (childClasses.length < 1) {
    ctx.reply(text(3), reply);
    return;
  }

  childClasses.push(text(4));
  ctx.reply(text(5), Markup.keyboard(childClasses)
    .oneTime()
    .resize()
    .extra());

  setState(id, 'settingMigrantClass', 1);
};

module.exports = migrantclass;
