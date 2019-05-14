'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  setState,
  findUser,
  newClass,
  getText,
  getDead,
  removeClass,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'findUser',
    'newClass',
    'getText',
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

const confirmation = ctx => {
  const { id } = ctx.message.from;
  const reply = answer.bind(null, ctx);
  if (getDead(id)) {
    reply(
      text(0) +
      text(7),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
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
    reply(text(0) + text(7));
    setState(id, 'addclass', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    reply(text(0) + text(5));
    setState(id, 'addclass', null);
    return;
  }

  const { text: message } = ctx.message;
  const userClassName = Object.keys(country.classes)
    .find(cl => country.classes[cl].creator === id);
  const userClass = country.classes[userClassName];

  //Yes
  if (message.match(new RegExp(`^${text(17)}$`, 'gi'))) {
    reply(text(0) + text(20));
    setState(id, 'addclass', null);
    userClass.creator = undefined;
    newClass(country.chat, userClassName, userClass);
    return;
  }

  //No
  if (message.match(new RegExp(`^${text(18)}$`, 'gi'))) {
    reply(text(0) + text(13));
    removeClass(country.chat, userClassName);
    setState(id, 'addclass', null);
    return;
  }

  reply(
    text(0) + text(8),
    Markup.keyboard([text(17), text(18)])
      .oneTime()
      .selective(true)
      .resize()
  );
};

module.exports = confirmation;
