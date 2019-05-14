'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  setState,
  findUser,
  getText,
  getAllClasses,
  getChildClasses,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'findUser',
    'getText',
    'getAllClasses',
    'getChildClasses',
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

const choosingTarget = ctx => {
  const reply = answer.bind(null, ctx);
  const { id } = ctx.message.from;
  if (ctx.message.text === text(11)) {
    setState(id, 'changeclass', null);
    reply(text(0) + text(12));
    return;
  }
  const country = findUser(id);
  if (!country) {
    reply(text(0) + text(2));
    setState(id, 'changeclass', null);
    return;
  }
  if (country.hasRevolution) {
    reply(text(0) + text(3));
    setState(id, 'changeclass', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    reply(text(0) + text(4));
    setState(id, 'changeclass', null);
    return;
  }
  const classlist = getAllClasses(country.chat);
  const userClassName = country.citizens[id].class;

  const childClasses = getChildClasses(userClassName, classlist);
  if (childClasses.length < 1) {
    reply(text(0) + text(5));
    setState(id, 'changeclass', null);
    return;
  }

  const slavelist = Object.keys(country.citizens)
    .filter(man =>
      childClasses.includes(country.citizens[man].class) ||
      man === id + ''
    );
  if (slavelist.length < 1) {
    reply(text(0) + text(6));
    setState(id, 'changeclass', null);
    return;
  }

  ctx.bot
    .telegram
    .getChat('alegator1209')
    .then(console.dir)
    .catch(console.error);
};

module.exports = choosingTarget;
