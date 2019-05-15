'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  getText,
  findUser,
  getChildClasses,
  getAllClasses,
  setState,
  getMigrationClass,
  getGame,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getText',
    'findUser',
    'getChildClasses',
    'getAllClasses',
    'setState',
    'getMigrationClass',
    'getGame',
  ]);
const text = t => getText('deleteclass')[t];

const deleteclass = ctx => {
  const { id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
  };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(id)) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  const country = findUser(id);
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(7), reply);
    return;
  }
  if (country.citizens[id].inPrison) {
    ctx.reply(text(0) + text(9), reply);
  }
  const classlist = getAllClasses(country.chat);
  const userClass = country.citizens[id].class;
  const childClasses = getChildClasses(userClass, classlist);
  if (childClasses.length < 1) {
    ctx.reply(text(0) + text(3), reply);
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
    ctx.reply(text(0) + text(4), reply);
    return;
  }
  emptyClasses.push(text(6));
  ctx.reply(
    text(0) + text(5),
    Extra
      .load(reply)
      .markup(Markup.keyboard(emptyClasses)
        .oneTime()
        .resize()
        .selective(true)
      )
  );

  setState(id, 'deleteclass', 'choosingClass');
};

module.exports = deleteclass;
