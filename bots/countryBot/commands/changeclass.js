'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  getAllClasses,
  findUser,
  setState,
  getChildClasses,
  getText,
  getGame,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getAllClasses',
    'findUser',
    'setState',
    'getChildClasses',
    'getText',
    'getGame',
  ]);
const text = t => getText('changeclass')[t];

const changeclass = ctx => {
  const { username, id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  const tag = username || id;
  if (getAdmins().includes(tag)) {
    ctx.repl(text(0) + text(1), reply);
    return;
  }
  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(10), reply);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }
  const classlist = getAllClasses(country.chat);
  const userClassName = country.citizens[tag].class;

  const childClasses = getChildClasses(userClassName, classlist);
  if (childClasses.length < 1) {
    ctx.reply(text(0) + text(4), reply);
    return;
  }

  const slavelist = Object.keys(country.citizens)
    .filter(man =>
      childClasses.includes(country.citizens[man].class) ||
      man === tag
    );
  if (slavelist.length < 1) {
    ctx.reply(text(0) + text(11), reply);
    return;
  }

  ctx.reply(
    text(0) + text(8),
    Extra
      .load(reply)
      .markup(Markup.keyboard([...slavelist, text(9)])
        .oneTime()
        .resize()
        .selective(true)
      )
  );
  setState(id, 'changingUserClass', 'choosingTarget');
};

module.exports = changeclass;
