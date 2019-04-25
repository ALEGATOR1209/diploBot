'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getStates,
  setState,
  findUser,
  getAllRights: rightslist,
  newClass,
  removeClass,
  getText,
  rightsString,
  getDead,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getStates',
    'setState',
    'findUser',
    'getAllRights',
    'newClass',
    'removeClass',
    'getText',
    'rightsString',
    'getDead',
  ]);
const text = t => getText('createClass')[t];

const answer = (ctx, text, markup) => ctx.reply(
  text,
  Extra
    .load({
      reply_to_message_id: ctx.message.message_id,
      parse_mode: 'HTML',
    })
    .markup(markup)
);

const enteringName = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = answer.bind(null, ctx);
  if (getDead(tag)) {
    reply(text(0) + text(1));
    setState(id, 'creatingClass', null);
    return;
  }
  const country = findUser(tag);
  if (!country) {
    reply(text(0) + text(2));
    setState(id, 'creatingClass', null);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(18), reply);
    setState(id, 'creatingClass', null);
    return;
  }
  if (country.citizens[tag].inPrison) {
    reply(text(0) + text(3));
    setState(id, 'creatingClass', null);
    return;
  }

  let name = ctx.message.text;

  if (!name) {
    reply(text(0) + text(4));
    return;
  }
  name = name.trim();
  if (country.classes[name] && Object.keys(country.classes[name]).length > 0) {
    reply(text(0) + text(19));
    setState(id, 'creatingClass', null);
    return;
  }

  const createdClass = {
    creator: id,
    rights: [],
    parentClass: country.citizens[tag].class,
    number: 0,
  };

  newClass(country.chat, name, createdClass);
  reply(
    text(0) + text(5) + rightsString([]),
    Markup.keyboard([text(6), text(7), ...rightslist])
      .oneTime()
      .resize()
      .selective(true)
  );
  setState(id, 'creatingClass', 'enteringRights');
};

const enteringRights = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = answer.bind(null, ctx);
  if (getDead(tag)) {
    reply(
      text(0) +
      text(1),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', null);
    return;
  }
  const country = findUser(tag);
  if (!country) {
    reply(
      text(0) +
      text(2),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', null);
    return;
  }
  if (country.hasRevolution) {
    reply(
      text(0) +
      text(18),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', null);
    return;
  }
  if (country.citizens[tag].inPrison) {
    reply(
      text(0) +
      text(3),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', null);
    return;
  }

  const right = ctx.message.text;
  if (right.match(new RegExp(`^${text(6)}$`, 'gi'))) {
    reply(
      text(0) +
      text(8),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', 'enteringNumber');
    return;
  }

  if (right.match(new RegExp(`^${text(7)}$`, 'gi'))) {
    reply(
      text(0) +
      text(9),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    const userClassName = Object.keys(country.classes)
      .find(cl => country.classes[cl].creator === id);
    removeClass(country.chat, userClassName);
    setState(id, 'creatingClass', null);
    return;
  }

  if (!rightslist.includes(right)) {
    reply(text(0) + text(8));
  }

  const userClassName = Object.keys(country.classes)
    .find(cl => country.classes[cl].creator === id);
  const userClass = country.classes[userClassName];
  userClass.rights.push(right);
  newClass(country.chat, userClassName, userClass);
  const list = rightslist.filter(el => !userClass.rights.includes(el));
  reply(
    text(0) +
    text(5) + rightsString(userClass.rights),
    Markup.keyboard([ text(6), text(7), ...list ])
      .oneTime()
      .resize()
      .selective(true)
  );
};

const enteringNumber = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = answer.bind(null, ctx);
  if (getDead(tag)) {
    reply(text(0) + text(1));
    setState(id, 'creatingClass', null);
    return;
  }
  const country = findUser(tag);
  if (!country) {
    reply(text(0) + text(2));
    setState(id, 'creatingClass', null);
    return;
  }
  if (country.hasRevolution) {
    reply(text(0) + text(18));
    setState(id, 'creatingClass', null);
    return;
  }
  if (country.citizens[tag].inPrison) {
    reply(text(0) + text(3));
    setState(id, 'creatingClass', null);
    return;
  }

  const number = Math.abs(parseInt(ctx.message.text));
  if (number !== 0 && !number) {
    reply(text(0) + text(4));
    return;
  }

  const userClassName = Object.keys(country.classes)
    .find(cl => country.classes[cl].creator === id);
  const userClass = country.classes[userClassName];
  userClass.number = number;
  newClass(country.chat, userClassName, userClass);
  reply(
    text(0) +
    text(15) + userClassName +
    text(10) +
    rightsString(userClass.rights) +
    text(11) + (number === 0 ? '∞' : number) +
    text(12),
    Markup.keyboard([text(13), text(14)])
      .oneTime()
      .selective(true)
      .resize()
  );
  setState(id, 'creatingClass', 'confirmation');
};

const confirmation = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = answer.bind(null, ctx);
  if (getDead(tag)) {
    reply(
      text(0) +
      text(1),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', null);
    return;
  }
  const country = findUser(tag);
  if (!country) {
    reply(
      text(0) +
      text(2),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', null);
    return;
  }
  if (country.hasRevolution) {
    reply(
      text(0) +
      text(18),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', null);
    return;
  }
  if (country.citizens[tag].inPrison) {
    reply(
      text(0) +
      text(3),
      Markup
        .removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', null);
    return;
  }

  const {text: message} = ctx.message;
  const userClassName = Object.keys(country.classes)
    .find(cl => country.classes[cl].creator === id);
  const userClass = country.classes[userClassName];
  if (message.match(new RegExp(`^${text(13)}$`, 'gi'))) {
    reply(
      text(0) + text(16),
      Markup.removeKeyboard(true)
        .selective(true)
    );
    setState(id, 'creatingClass', null);
    userClass.creator = undefined;
    newClass(country.chat, userClassName, userClass);
    return;
  }
  if (message.match(new RegExp(`^${text(14)}$`, 'gi'))) {
    reply(
      text(0) + text(17),
      Markup.removeKeyboard(true)
        .selective(true)
    );
    removeClass(country.chat, userClassName);
    setState(id, 'creatingClass', null);
    return;
  }

  reply(
    text(0) + text(4),
    Markup.keyboard([text(13), text(14)])
      .oneTime()
      .selective(true)
      .resize()
  );
};

const stateHandlers = {
  enteringName,
  enteringRights,
  enteringNumber,
  confirmation,
};

const createClass = ctx => stateHandlers[
  getStates(ctx.message.from.id).creatingClass
](ctx);

module.exports = createClass;
