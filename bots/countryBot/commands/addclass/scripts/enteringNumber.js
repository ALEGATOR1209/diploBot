'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  setState,
  findUser,
  newClass,
  getText,
  rightsString,
  getDead,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'findUser',
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

const enteringNumber = ctx => {
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

  const number = Math.abs(parseInt(ctx.message.text));
  if (number !== 0 && !number) {
    reply(text(0) + text(8));
    return;
  }

  const userClassName = Object.keys(country.classes)
    .find(cl => country.classes[cl].creator === id);
  const userClass = country.classes[userClassName];
  userClass.number = number;
  newClass(country.chat, userClassName, userClass);
  reply(
    text(0) +
    text(19) + userClassName +
    text(14) +
    rightsString(userClass.rights) +
    text(15) + (number === 0 ? '∞' : number) +
    text(16),
    Markup.keyboard([text(17), text(18)])
      .oneTime()
      .selective(true)
      .resize()
  );
  setState(id, 'addclass', 'confirmation');
};

module.exports = enteringNumber;
