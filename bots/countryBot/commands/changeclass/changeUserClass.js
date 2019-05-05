'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getStates,
  setState,
  findUser,
  getText,
  editUser,
  getAllClasses,
  getChildClasses,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getStates',
    'setState',
    'findUser',
    'getText',
    'editUser',
    'getAllClasses',
    'getChildClasses',
  ]);
const text = t => getText('changeUserClass')[t];
const infoText = getText('changeclass')[0];
const cancel = getText('changeclass')[9];

const answer = (ctx, text, markup) => ctx.reply(
  text,
  Extra
    .load({
      reply_to_message_id: ctx.message.message_id,
    })
    .markup(markup ? markup : Markup.removeKeyboard(true).selective(true))
);

const choosingTarget = ctx => {
  const reply = answer.bind(null, ctx);
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);
  if (ctx.message.text === cancel) {
    setState(id, 'changingUserClass', null);
    reply(infoText + text(0));
    return;
  }
  if (!country) {
    reply(infoText + text(6));
    setState(id, 'changingUserClass', null);
    return;
  }
  if (country.hasRevolution) {
    reply(infoText + text(5));
    setState(id, 'changingUserClass', null);
    return;
  }
  if (country.citizens[tag].inPrison) {
    reply(infoText + text(7));
    setState(id, 'changingUserClass', null);
    return;
  }
  const classlist = getAllClasses(country.chat);
  const userClassName = country.citizens[tag].class;

  const childClasses = getChildClasses(userClassName, classlist);
  if (childClasses.length < 1) {
    reply(infoText + text(8));
    setState(id, 'changingUserClass', null);
    return;
  }

  const slavelist = Object.keys(country.citizens)
    .filter(man =>
      childClasses.includes(country.citizens[man].class) ||
      man === tag
    );
  if (slavelist.length < 1) {
    reply(infoText + text(9));
    setState(id, 'changingUserClass', null);
    return;
  }

  let slave = ctx.message.text;
  if (!slavelist.includes(slave)) {
    reply(infoText + text(10));
    setState(id, 'changingUserClass', null);
    return;
  }
  if (slave[0] === '@') slave = slave.slice(1);

  reply(
    infoText + text(11) + `@${slave}`,
    Markup.keyboard([...childClasses, cancel])
      .oneTime()
      .resize()
      .selective(true)
  );
  setState(id, 'changingUserClass', slave);
};

const choosingClass = ctx => {
  const reply = answer.bind(null, ctx);
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const userCountry = findUser(tag);
  const slave = getStates(id).changingUserClass;
  const slaveCountry = findUser(slave);
  const newClass = ctx.message.text
    .trim();

  if (!userCountry) {
    reply(text(0) + text(6));
    setState(id, 'changingUserClass', null);
    return;
  }
  if (userCountry.citizens[tag].inPrison) {
    reply(text(0) + text(7));
    setState(id, 'changingUserClass', null);
    return;
  }
  const classlist = getAllClasses(userCountry.chat);
  const userClassName = userCountry.citizens[tag].class;

  const childClasses = getChildClasses(userClassName, classlist);
  if (childClasses.length < 1) {
    reply(infoText + text(8));
    setState(id, 'changingUserClass', null);
    return;
  }

  const slavelist = Object.keys(userCountry.citizens)
    .filter(man =>
      childClasses.includes(userCountry.citizens[man].class) ||
      man === tag
    );
  if (slavelist.length < 1) {
    reply(infoText + text(9));
    setState(id, 'changingUserClass', null);
    return;
  }
  if (ctx.message.text === cancel) {
    setState(id, 'changingUserClass', null);
    reply(infoText + text(0));
    return;
  }

  if (!slaveCountry || slaveCountry.chat !== userCountry.chat) {
    setState(id, 'changingUserClass', null);
    reply(infoText + text(1));
    return;
  }
  if (!getAllClasses(userCountry.chat)[newClass]) {
    setState(id, 'changingUserClass', null);
    reply(infoText + text(2));
    return;
  }
  if (userCountry.hasRevolution) {
    setState(id, 'changingUserClass', null);
    reply(infoText + text(5));
    return;
  }
  const classCapacity = userCountry.classes[newClass].number;
  const classUsers = Object.keys(userCountry.citizens)
    .filter(man => userCountry.citizens[man].class === newClass);
  if (
    !classUsers.includes(slave) &&
    classCapacity > 0           &&
    classUsers.length >= classCapacity
  ) {
    reply(infoText + text(12));
    setState(id, 'changingUserClass', null);
    return;
  }

  if (userCountry.citizens[slave].class === newClass) {
    reply(
      infoText +
      text(13)
        .replace('{slave}', `@${slave}`)
        .replace('{slaveClass}', newClass)
    );
    setState(id, 'changingUserClass', null);
    return;
  }

  editUser(userCountry.chat, slave, { class: newClass });
  setState(id, 'changingUserClass', null);
  reply(infoText + text(3));
  ctx.reply(
    `@${slave} ${text(4)} ${newClass}`,
    { chat_id: `@${slaveCountry.chat}` }
  );
};

const changeUserClass = ctx => {
  const states = getStates(ctx.message.from.id);
  if (states.changingUserClass === 'choosingTarget') {
    choosingTarget(ctx);
  } else choosingClass(ctx);
};

module.exports = changeUserClass;
