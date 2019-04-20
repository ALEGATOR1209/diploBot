'use strict';

const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  getRevolutionDemands,
  setState,
  getStates,
  setRevolution,
  getRevolution,
  declareRevolutionaryDemands
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getRevolutionDemands',
    'setState',
    'getStates',
    'setRevolution',
    'getRevolution',
    'declareRevolutionaryDemands'
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
    cost: 30,
  };
  setRevolution(country.chat, id, revolution, false);
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
    setRevolution(country.chat, id);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(text(2), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      text(3) + country.name,
      Markup.removeKeyboard(true).extra(),
      reply
    );
    setRevolution(country.chat, id);
    setState(id, 'preparingRevolution', null);
    return;
  }

  const right = ctx.message.text;
  //Cancel
  if (right.match(new RegExp(`^${text(7)}$`))) {
    ctx.reply(text(4), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  //Done
  if (right.match(new RegExp(`^${text(10)}$`))) {
    ctx.reply(
      text(15),
      Markup.keyboard([text(16), text(17)])
        .oneTime()
        .resize()
        .extra(),
      reply
    );
    setState(id, 'preparingRevolution', 'confirmation');
    return;
  }

  const userClass = country.citizens[tag].class;
  const parentClass = country.classes[userClass].parentClass;
  const parentRights = country.classes[parentClass].rights;
  if (!parentRights.includes(right)) {
    parentRights.push(text(10));
    parentRights.push(text(7));
    ctx.reply(
      text(11),
      Markup.keyboard(parentRights)
        .oneTime()
        .resize()
        .extra()
    );
    return;
  }

  const revolution = getRevolution(country.chat, id);
  if (!revolution) {
    ctx.reply(12);
    return;
  }
  if (!revolution.demands) revolution.demands = [];
  revolution.demands.push(right);
  revolution.cost += 10;
  const otherRights = [text(10), text(7), ...parentRights.filter(
    el => !revolution.demands.includes(el)
  )];
  setRevolution(country.chat, id, revolution);
  ctx.reply(
    right + text(13) + revolution.cost + text(14),
    Markup.keyboard(otherRights)
      .oneTime()
      .resize()
      .extra()
  );
};

const choosingParent = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(1), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(text(2), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      text(3) + country.name,
      Markup.removeKeyboard(true).extra(),
      reply
    );
    setRevolution(country.chat, id);
    setState(id, 'preparingRevolution', null);
    return;
  }

  const newParent = ctx.message.text;
  if (!Object.keys(country.classes).includes(newParent)) {
    ctx.reply(text(5), Markup.keyboard([
      text(7),
      ...Object.keys(country.classes)
        .filter(el => el !== country.citizens[tag].class)
    ])
      .oneTime()
      .resize()
      .extra()
    );
    return;
  }

  const revolution = getRevolution(country.chat, id);
  if (!revolution) {
    ctx.reply(12);
    return;
  }
  revolution.demands = newParent;
  revolution.cost = 60;
  setRevolution(country.chat, id, revolution);
  setState(id, 'preparingRevolution', 'confirmation');
  ctx.reply(
    text(18) +
    country.citizens[tag].class +
    text(19) +
    newParent +
    text(13) +
    revolution.cost +
    text(14)
  )
    .then(() => ctx.reply(
      text(15),
      Markup.keyboard([text(16), text(17)])
        .oneTime()
        .resize()
        .extra()
    ));
};

const confirmation = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(1), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(text(2), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      text(3) + country.name,
      Markup.removeKeyboard(true).extra(),
      reply
    );
    setRevolution(country.chat, id);
    setState(id, 'preparingRevolution', null);
    return;
  }
  //Cancel
  const { text: message } = ctx.message;
  if (message.match(new RegExp(`^${text(17)}$`))) {
    ctx.reply(text(4), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  //Done
  if (message.match(new RegExp(`^${text(16)}$`))) {
    ctx.reply(text(16), Markup.removeKeyboard(true).extra(), reply);
    setState(id, 'preparingRevolution', null);
    const revolution = getRevolution(country.chat, id);
    setRevolution(country.chat, id, revolution, true);
    declareRevolutionaryDemands(ctx);
    return;
  }
  ctx.reply(text(5), Markup.keyboard([text(16), text(17)])
    .oneTime()
    .resize()
    .extra()
  );
};

const revolutionHandlers = {
  startRevolution,
  choosingRights,
  choosingParent,
  confirmation,
};

const chooseHandler = ctx => {
  const state = getStates(ctx.message.from.id);
  if (state.preparingRevolution)
    revolutionHandlers[state.preparingRevolution](ctx);
};

module.exports = chooseHandler;
