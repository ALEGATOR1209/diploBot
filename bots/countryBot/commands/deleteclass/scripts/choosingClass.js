'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getText,
  findUser,
  setState,
  getChildClasses,
  getAllClasses,
  removeClass,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'findUser',
    'setState',
    'getChildClasses',
    'getAllClasses',
    'removeClass',
  ]);
const text = t => getText('deleteclass')[t];
const answer = (ctx, text, markup = null, opts = {}) => ctx.reply(
  text,
  Extra
    .load(opts || {
      reply_to_message_id: ctx.message.message_id,
      parse_mode: 'HTML',
    })
    .markup(markup || Markup
      .removeKeyboard(true)
      .selective(true)
    )
);

const deleteClass = ctx => {
  const { id } = ctx.message.from;
  const reply = answer.bind(null, ctx);
  const country = findUser(id);

  if (ctx.message.text.match(
    new RegExp(`^${text(6)}$`, 'gi')
  )) {
    reply(text(0) + text(8));
    setState(id, 'deletingClass', null);
    return;
  }

  if (!country) {
    reply(text(0) + text(2));
    setState(id, 'deletingClass', null);
    return;
  }
  if (country.hasRevolution) {
    reply(text(0) + text(7));
    setState(id, 'deletingClass', null);
    return;
  }

  if (country.citizens[id].inPrison) {
    reply(text(0) + text(9));
    setState(id, 'deletingClass', null);
    return;
  }

  const userClass = country.citizens[id].class;
  const classlist = getAllClasses(country.chat);
  const childClasses = getChildClasses(userClass, classlist);

  const emptyClasses = childClasses.filter(classname => {
    for (const man in country.citizens) {
      if (country.citizens[man].class === classname) return false;
    }
    return true;
  });
  if (emptyClasses.length < 1) {
    reply(text(0) + text(4));
    setState(id, 'deletingClass', null);
    return;
  }

  const classToDelete = ctx.message.text;
  if (!emptyClasses.includes(classToDelete)) {
    reply(text(0) + text(5));
    setState(id, 'deletingClass', null);
    return;
  }

  removeClass(country.chat, classToDelete);
  setState(id, 'deletingClass', null);
  if (ctx.message.chat.username !== country.chat) {
    reply(text(11));
  }
  reply(
    text(12)
      .replace('{class}', classToDelete),
    null,
    { chat_id: `@${country.chat}` }
  );
};

module.exports = deleteClass;
