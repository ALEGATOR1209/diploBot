'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  getAllClasses,
  findUser,
  setState,
  getChildClasses,
  getText,
  getGame,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getAllClasses',
    'findUser',
    'setState',
    'getChildClasses',
    'getText',
    'getGame',
  ]);
const text = t => getText('changeclass')[t];

const changeclass = ctx => {
  const { id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(id)) {
    ctx.repl(text(0) + text(1), reply);
    return;
  }
  const country = findUser(id);
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }
  if (country.citizens[id].inPrison) {
    ctx.reply(text(0) + text(4), reply);
    return;
  }
  const classlist = getAllClasses(country.chat);
  const userClassName = country.citizens[id].class;

  const childClasses = getChildClasses(userClassName, classlist);
  if (childClasses.length < 1) {
    ctx.reply(text(0) + text(5), reply);
    return;
  }

  const slavelist = Object.keys(country.citizens)
    .filter(man =>
      childClasses.includes(country.citizens[man].class) ||
      man === id + ''
    );

  if (slavelist.length < 1) {
    ctx.reply(text(0) + text(6), reply);
    return;
  }

  const slaveTags = [];
  const getUsername = () => ctx.bot
    .telegram
    .getChat(slavelist.pop())
    .then(({ username }) => {
      slaveTags.push(username);
      if (slavelist.length >= slaveTags.length) {
        return getUsername();
      }
      ctx.reply(
        text(0) + text(7),
        Extra
          .load(reply)
          .markup(Markup.keyboard([...slaveTags, text(11)])
            .oneTime()
            .resize()
            .selective(true)
          )
      );
      setState(id, 'changeclass', 'choosingTarget');
    })
    .catch(console.error);
  getUsername();
};

module.exports = changeclass;
