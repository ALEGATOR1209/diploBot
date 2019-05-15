'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  setState,
  findUser,
  getText,
  getAllClasses,
  getChildClasses,
  getStates,
  editUser,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'findUser',
    'getText',
    'getAllClasses',
    'getChildClasses',
    'getStates',
    'editUser',
  ]);
const text = t => getText('changeclass')[t];

const answer = (ctx, text, markup) => ctx.reply(
  text,
  Extra
    .load({
      reply_to_message_id: ctx.message.message_id,
    })
    .markup(markup || Markup
      .removeKeyboard(true)
      .selective(true)
    )
);

const choosingClass = ctx => {
  const reply = answer.bind(null, ctx);
  const { id } = ctx.message.from;
  const userCountry = findUser(id);
  const slave = getStates(id).changeclass;
  const slaveCountry = findUser(slave);
  const newClass = ctx.message.text
    .trim();

  if (!userCountry) {
    reply(text(0) + text(2));
    setState(id, 'changeclass', null);
    return;
  }
  if (userCountry.citizens[id].inPrison) {
    reply(text(0) + text(4));
    setState(id, 'changeclass', null);
    return;
  }
  const classlist = getAllClasses(userCountry.chat);
  const userClassName = userCountry.citizens[id].class;

  const childClasses = getChildClasses(userClassName, classlist);
  if (childClasses.length < 1) {
    reply(text(0) + text(5));
    setState(id, 'changeclass', null);
    return;
  }

  const slavelist = Object.keys(userCountry.citizens)
    .filter(man =>
      childClasses.includes(userCountry.citizens[man].class) ||
      man === id + ''
    );
  if (slavelist.length < 1) {
    reply(text(0) + text(6));
    setState(id, 'changeclass', null);
    return;
  }
  if (ctx.message.text === text(11)) {
    setState(id, 'changeclass', null);
    reply(text(0) + text(12));
    return;
  }

  if (!slaveCountry || slaveCountry.chat !== userCountry.chat) {
    setState(id, 'changeclass', null);
    reply(text(0) + text(9));
    return;
  }
  if (!getAllClasses(userCountry.chat)[newClass]) {
    setState(id, 'changeclass', null);
    reply(text(0) + text(2));
    return;
  }
  if (userCountry.hasRevolution) {
    setState(id, 'changeclass', null);
    reply(text(0) + text(3));
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
    reply(text(0) + text(12));
    setState(id, 'changeclass', null);
    return;
  }

  if (userCountry.citizens[slave].class === newClass) {
    reply(
      text(0) +
      text(17)
        .replace('{slaveClass}', newClass)
    );
    setState(id, 'changeclass', null);
    return;
  }

  editUser(userCountry.chat, slave, { class: newClass });
  setState(id, 'changeclass', null);
  ctx.bot
    .telegram
    .getChat(slave)
    .then(({ username }) => {
      if (ctx.message.chat.username !== userCountry.chat)
        reply(text(0) + text(18));
      ctx.reply(
        text(19)
          .replace('{username}', `@${username}`)
          .replace('{class}', newClass),
        { chat_id: `@${slaveCountry.chat}` }
      );
    })
    .catch(console.error);
};

module.exports = choosingClass;
