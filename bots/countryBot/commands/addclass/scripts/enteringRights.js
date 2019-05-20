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
  removeClass,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'findUser',
    'getAllRights',
    'newClass',
    'getText',
    'rightsString',
    'getDead',
    'removeClass',
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

const enteringRights = ctx => {
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
    reply(text(0) + text(6));
    setState(id, 'addclass', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    reply(text(0) + text(5));
    setState(id, 'addclass', null);
    return;
  }

  const input = ctx.message.text;
  //Done
  if (input.match(new RegExp(`^${text(10)}$`, 'gi'))) {
    reply(text(0) + text(12));
    setState(id, 'addclass', 'enteringNumber');
    return;
  }

  //Cancel
  if (input.match(new RegExp(`^${text(11)}$`, 'gi'))) {
    reply(text(0) + text(13));
    Object.keys(country.classes)
      .filter(cl => country.classes[cl].creator === id)
      .forEach(cl => removeClass(country.chat, cl));
    setState(id, 'addclass', null);
    return;
  }

  const rightCode = Object.keys(rightslist)
    .find(right => rightslist[right] === input);
  if (!rightCode) {
    reply(text(0) + text(8));
    return;
  }
  const parentClassName = country.citizens[id].class;
  const userClassName = Object.keys(country.classes)
    .find(cl => country.classes[cl].creator === id);
  const parentClass = country.classes[parentClassName];
  const userClass = country.classes[userClassName];
  if (!parentClass.rights.includes(rightCode)) {
    const list = Object.keys(rightslist)
      .filter(right =>
        parentClass.rights.includes(right) &&
        !userClass.rights.includes(right))
      .map(code => rightslist[code]);
    reply(
      text(0) + text(25),
      Markup.keyboard([ text(10), text(11), ...list ])
        .oneTime()
        .resize()
        .selective(true)
    );
    return;
  }

  userClass.rights.push(rightCode);
  newClass(country.chat, userClassName, userClass);
  const list = Object.keys(rightslist)
    .filter(right =>
      parentClass.rights.includes(right)  &
      !userClass.rights.includes(right))
    .map(code => rightslist[code]);
  reply(
    text(0) +
    text(9) + rightsString(userClass.rights),
    Markup.keyboard([ text(10), text(11), ...list ])
      .oneTime()
      .resize()
      .selective(true)
  );
};

module.exports = enteringRights;
