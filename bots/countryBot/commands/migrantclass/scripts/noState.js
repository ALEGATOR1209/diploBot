'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getText,
  findUser,
  setState,
  getGame,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'findUser',
    'setState',
    'getGame',
  ]);
const text = t => getText('migrantclass')[t];

const migrantclass = ctx => {
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  const country = findUser(id);
  if (!country) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(6), reply);
    return;
  }
  if (country.citizens[id].inPrison) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }

  const userClass = country.citizens[id].class;
  const hasLawRights = country
    .classes[userClass]
    .rights
    .includes('ADOPTING_LAWS');
  if (!hasLawRights) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }

  const classlist = Object.keys(country.classes)
    .filter(cl => !(country.classes[cl].number || country.migrantClass === cl));

  if (classlist.length < 1) {
    ctx.reply(
      text(0) + text(11),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    return;
  }
  classlist.push(text(4));
  ctx.reply(
    text(0) +
    text(5),
    Extra
      .load(reply)
      .markup(Markup.keyboard(classlist)
        .oneTime()
        .resize()
        .selective(true)
      )
  );

  setState(id, 'migrantclass', 'choosingClass');
};

module.exports = migrantclass;
