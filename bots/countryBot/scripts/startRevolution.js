'use strict';

const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  getRevolutionDemands,
  setState,
  getStates,
  setRevolution,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getRevolutionDemands',
    'setState',
    'getStates',
    'setRevolution',
  ]);
const text = t => getText('startRevolution')[t];

const startRevolution = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(1), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(text(2), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      text(3) + country.name,
      Markup.removeKeyboard(true).extra(),
      reply
    );
    setState(id, 'preparingRevolution', null);
    return;
  }

  const demands = ctx.message.text;
  if (demands.match(new RegExp(`^${text(7)}$`))) {
    ctx.reply(text(4), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    return;
  }

  const REVOLUTION_DEMANDS = getRevolutionDemands();
  const type = Object.keys(REVOLUTION_DEMANDS)
    .find(el => REVOLUTION_DEMANDS[el] === demands);

  if (!type) {
    ctx.reply(text(5), Markup.removeKeyboard(true).extra());
    setState(id, 'preparingRevolution', null);
    return;
  }

  const userClass = country
    .citizens[tag]
    .class;
  const parentClass = country
    .classes[userClass]
    .parentClass;
  if (!parentClass) {
    ctx.reply(text(6), reply);
    setState(id, 'preparingRevolution', null);
    return;
  }
  const handleType = {
    'RIGHTS': () => {
      const rights = country.classes[parentClass].rights;
      rights.push(text(7));
      rights.push(text(10));
      ctx.reply(text(8), Markup.keyboard(rights)
        .oneTime()
        .resize()
        .extra());
      setState(id, 'preparingRevolution', 'choosingRights');
    },
    'CHANGE_PARENT': () => {
      const parents = Object.keys(country.classes)
        .filter(el => el !== userClass);
      parents.push(text(7));
      parents.push(text(10));
      ctx.reply(text(9), Markup.keyboard(parents)
        .oneTime()
        .resize()
        .extra());
      setState(id, 'preparingRevolution', 'choosingParent');
    }
  };
  const revolution = {
    type,
    revolter: userClass,
  };
  setRevolution(country.chat, revolution, false);
  handleType[type]();
};

const choosingRights = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(1), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(text(2), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      text(3) + country.name,
      Markup.removeKeyboard(true).extra(),
      reply
    );
    setRevolution(country.chat);
    setState(id, 'preparingRevolution', null);
    return;
  }

  const right = ctx.message.text;
  if (right.match(new RegExp(`^${text(7)}$`))) {
    ctx.reply(text(4), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat);
    return;
  }
};

const choosingParent = ctx => {};

const confirming = ctx => {};

const revolutionHandlers = {
  startRevolution,
  choosingRights,
  choosingParent,
  confirming,
};

const chooseHandler = ctx => {
  const state = getStates(ctx.message.from.id);
  if (state.preparingRevolution)
    revolutionHandlers[state.preparingRevolution](ctx);
};

module.exports = chooseHandler;
