'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  setState,
  findUser,
  getAllRights: rightslist,
  newClass,
  getText,
  rightsString,
  getDead,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'findUser',
    'getAllRights',
    'newClass',
    'getText',
    'rightsString',
    'getDead',
  ]);
const text = t => getText('addclass')[t];
const answer = (
  ctx,
  text,
  markup = Markup
    .removeKeyboard(true)
    .selective(true)
) => ctx.reply(
  text,
  Extra
    .load({
      reply_to_message_id: ctx.message.message_id,
      parse_mode: 'HTML',
    })
    .markup(markup)
);

const enteringName = ctx => {
  const { id } = ctx.message.from;
  const reply = answer.bind(null, ctx);
  if (getDead(id)) {
    reply(text(0) + text(7));
    setState(id, 'addclass', null);
    return;
  }
  const country = findUser(id);
  if (!country) {
    reply(text(0) + text(2));
    setState(id, 'addclass', null);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(6), reply);
    setState(id, 'addclass', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    reply(text(0) + text(5));
    setState(id, 'addclass', null);
    return;
  }

  let name = ctx.message.text;

  if (!name) {
    reply(text(0) + text(8));
    return;
  }
  name = name.trim();
  if (name.match(/\./gi)) {
    reply(text(0) + text(24));
    return;
  }
  if (country.classes[name] && Object.keys(country.classes[name]).length > 0) {
    reply(text(0) + text(23));
    setState(id, 'addclass', null);
    return;
  }

  const createdClass = {
    creator: id,
    rights: [],
    parentClass: country.citizens[id].class,
    number: 0,
  };

  newClass(country.chat, name, createdClass);
  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  const list = Object.keys(rightslist)
    .filter(right => userClass.rights.includes(right))
    .map(code => rightslist[code]);
  reply(
    text(0) + text(9) + rightsString([]),
    Markup.keyboard([text(10), text(11), ...list])
      .oneTime()
      .resize()
      .selective(true)
  );
  setState(id, 'addclass', 'enteringRights');
};

module.exports = enteringName;
