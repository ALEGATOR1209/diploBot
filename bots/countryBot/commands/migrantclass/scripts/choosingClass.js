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
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'findUser',
    'getChildClasses',
    'getAllClasses',
    'setState',
    'setMigrationClass',
  ]);
const text = t => getText('migrantclass')[t];

const choosingClass = ctx => {
  const {id} = ctx.message.from;
  const reply = {reply_to_message_id: ctx.message.message_id};

  if (ctx.message.text.match(new RegExp(`^${text(4)}$`, 'gi'))) {
    ctx.reply(
      text(0) +
      text(7),
      Extra
        .load(reply)
        .markup(Markup
          .removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'migrantclass', null);
    return;
  }

  const country = findUser(id);
  if (!country) {
    ctx.reply(
      text(0) +
      text(1),
      Extra
        .load(reply)
        .markup(Markup
          .removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'migrantclass', null);
    return;
  }

  if (country.citizens[id].inPrison) {
    ctx.reply(
      text(0) +
      text(3),
      Extra
        .load(reply)
        .markup(Markup
          .removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'migrantclass', null);
    return;
  }

  const userClass = country.citizens[id].class;
  const hasLawRights = country
    .classes[userClass]
    .rights
    .includes('ADOPTING_LAWS');
  if (!hasLawRights) {
    ctx.reply(
      text(0) +
      text(2),
      Extra
        .load(reply)
        .markup(Markup
          .removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'migrantclass', null);
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
    setState(id, 'migrantclass', null);
    return;
  }
  const migrantClass = ctx.message.text;
  if (!classlist.includes(migrantClass)) {
    ctx.reply(
      text(0) +
      text(8),
      Extra
        .load(reply)
        .markup(Markup
          .removeKeyboard(true)
          .selective(true)
        )
    );
    setState(id, 'migrantclass', null);
    return;
  }

  setMigrationClass(country.chat, migrantClass);
  if (country.chat !== ctx.message.chat.username) {
    ctx.reply(
      text(0) +
      text(9)
        .replace('{class}', migrantClass),
      Extra
        .load({ chat_id: `@${country.chat}` })
        .HTML()
        .markup(Markup
          .removeKeyboard(true)
          .selective(true)
        )
    );
  }
  ctx.reply(
    text(0) + text(10),
    Extra
      .load(reply)
      .markup(Markup
        .removeKeyboard(true)
        .selective(true)
      )
  );
  setState(id, 'migrantclass', null);
};

module.exports = choosingClass;
