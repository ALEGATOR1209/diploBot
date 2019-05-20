'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  getRevolution,
  setState,
  setRevolution,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getRevolution',
    'setState',
    'setRevolution',
  ]);
const text = t => getText('revolution')[t];
const answer = (
  ctx,
  text,
  markup = Markup
    .removeKeyboard(true)
    .selective(true),
  options = null
) => ctx
  .reply(
    text,
    Extra
      .load(options || {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML',
      })
      .markup(markup)
  );

const choosingParent = ctx => {
  const reply = answer.bind(null, ctx);
  const { id } = ctx.message.from;

  const country = findUser(id);
  if (!country) {
    reply(text(0) + text(2));
    setState(id, 'revolution', null);
    return;
  }

  const inPrison = country.citizens[id].inPrison;
  if (inPrison) {
    reply(text(0) + text(3));
    setState(id, 'revolution', null);
    setRevolution(country.chat, id);
    return;
  }
  if (country.hasRevolution) {
    reply(text(0) + text(4));
    setRevolution(country.chat, id);
    setState(id, 'revolution', null);
    return;
  }

  const newParent = ctx.message.text;
  const userClass = country.citizens[id].class;
  if (!Object.keys(country.classes).includes(newParent)) {
    reply(text(0) + text(8), Markup.keyboard(
      Object.keys(country.classes)
        .filter(cl =>
          cl !== userClass &&
          cl !== userClass.parentClass
        )
    )
      .oneTime()
      .resize()
      .selective(true)
    );
    setState(id, 'revolution', null);
    return;
  }

  const revolution = getRevolution(country.chat, id);
  if (!revolution) {
    reply(text(0) + text(8));
    setState(id, 'revolution', null);
    return;
  }

  revolution.demands = newParent;
  setRevolution(country.chat, id, revolution);
  setState(id, 'revolution', 'confirmation');

  reply(
    text(0) +
    text(22) +
    text(23)
      .replace('{parent}', newParent)
      .replace('{child}', userClass) +
    text(14),
    Markup
      .keyboard([text(15), text(16)])
      .oneTime()
      .resize()
      .selective(true)
  );
};

module.exports = choosingParent;
