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
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getStates',
    'setState',
    'findUser',
    'getText',
    'editUser',
    'getAllClasses',
  ]);
const text = t => getText('changeclass')[0] + getText('changeUserClass')[t];

const changeUserClass = ctx => {
  const reply = (text) => ctx.reply(
    text,
    Extra
      .load({
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'Markdown',
      })
      .markup(Markup.removeKeyboard(true).selective(true))
  );

  const { username, id } = ctx.message.from;
  const tag = username || id;
  const userCountry = findUser(tag);
  const slave = getStates(id).changingUserClass;
  const slaveCountry = findUser(slave);
  const newClass = ctx.message.text
    .trim();

  if (ctx.message.text === getText('changeclass')[9]) {
    setState(id, 'changingUserClass', null);
    reply(text(0));
    return;
  }

  if (!slaveCountry || slaveCountry.chat !== userCountry.chat) {
    setState(id, 'changingUserClass', null);
    reply(text(1));
    return;
  }
  if (!getAllClasses(userCountry.chat)[newClass]) {
    setState(id, 'changingUserClass', null);
    reply(text(2));
    return;
  }
  if (userCountry.hasRevolution) {
    setState(id, 'changingUserClass', null);
    reply(text(5));
    return;
  }

  editUser(userCountry.chat, slave, { class: newClass });
  setState(id, 'changingUserClass', null);
  reply(text(3));
  ctx.reply(
    `@${slave} ${text(4)} ${newClass}`,
    { chat_id: `@${slaveCountry.chat}` }
  );
};

module.exports = changeUserClass;
