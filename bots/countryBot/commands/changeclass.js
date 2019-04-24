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
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getAllClasses',
    'findUser',
    'setState',
    'getChildClasses',
    'getText',
  ]);
const text = t => getText('changeclass')[t];

const changeclass = ctx => {
  const { username, id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'Markdown',
  };
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

  let slave = ctx.message.text
    .match(/@.*$/g);
  if (!slave) {
    ctx.reply(text(0) + text(5), reply);
    return;
  }
  slave = slave[0].trim();

  if (slave[0] === '@') slave = slave.slice(1);
  if (!slave) slave = username || id;

  const slaveCountry = findUser(slave);
  if (!slaveCountry || slaveCountry.chat !== country.chat) {
    ctx.reply(text(0) + text(6), reply);
    return;
  }

  const slaveClass = slaveCountry.citizens[slave].class;
  if (
    !childClasses.find(x => x === slaveClass) &&
    slaveClass !== 'default' &&
    slave !== tag
  ) {
    ctx.reply(text(0) + text(7), reply);
    return;
  }

  ctx.reply(
    text(0) + text(8),
    Extra
      .load(reply)
      .markup(Markup.keyboard([text(9), ...childClasses])
        .oneTime()
        .resize()
        .selective(true)
      )
  );

  setState(id, 'changingUserClass', slave);
};

module.exports = changeclass;
