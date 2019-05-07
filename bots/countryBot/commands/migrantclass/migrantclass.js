'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getText,
  findUser,
  getChildClasses,
  getAllClasses,
  setState,
  getGame,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'findUser',
    'getChildClasses',
    'getAllClasses',
    'setState',
    'getGame',
  ]);
const text = t => getText('migrantclass')[t];

const migrantclass = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  if (!country) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(6), reply);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(0) + text(6), reply);
    return;
  }

  const userClass = country.citizens[tag].class;
  const hasLawRights = country
    .classes[userClass]
    .rights
    .includes('Право на принятие законов');
  if (!hasLawRights) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }

  const classlist = getAllClasses(country.chat);
  const childClasses = getChildClasses(userClass, classlist);
  if (childClasses.length < 1) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }
  childClasses.filter(cl => country.classes[cl].number);

  childClasses.push(text(4));
  ctx.reply(
    text(0) +
    text(5),
    Extra
      .load(reply)
      .markup(Markup.keyboard([...childClasses])
        .oneTime()
        .resize()
        .selective(true)
      )
  );

  setState(id, 'settingMigrantClass', 1);
};

module.exports = migrantclass;