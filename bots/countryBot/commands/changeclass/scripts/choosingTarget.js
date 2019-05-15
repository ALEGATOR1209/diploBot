'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  setState,
  findUser,
  getText,
  getAllClasses,
  getChildClasses,
  getPlayers,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'findUser',
    'getText',
    'getAllClasses',
    'getChildClasses',
    'getPlayers',
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

  const target = ctx.message.text;
  if (!target) {
    reply(text(0) + text(8));
    setState(id, 'changeclass', null);
    return;
  }
  const players = getPlayers();
  let found = false;
  const getTag = () => ctx.bot
    .telegram
    .getChat(players.pop())
    .then(({ id: targetId, username }) => {
      if (username === target) {
        const targetCountry = findUser(targetId);
        found = true;
        if (targetCountry.chat !== country.chat) {
          reply(text(0) + text(9));
          setState(id, 'changeclass', null);
          return;
        }

        const targetClass = country.citizens[targetId].class;
        if (!childClasses.includes(targetClass) && targetId !== id) {
          reply(text(0) + text(10));
          setState(id, 'changeclass', null);
          return;
        }

        reply(
          text(0) + text(13),
          Markup.keyboard([...childClasses, text(11)])
            .oneTime()
            .resize()
            .selective(true)
        );
        setState(id, 'changeclass', targetId);
        return;
      }
      if (players.length < 1 && !found) {
        reply(text(0) + text(14));
        setState(id, 'changeclass', null);
        return;
      }
      getTag();
    })
    .catch(console.error);
  getTag();
};

module.exports = choosingTarget;
