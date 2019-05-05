'use strict';

const Extra = require('telegraf/extra');
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
const infoText = getText('revolution')[0];

const startRevolution = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  const country = findUser(tag);
  if (!country) {
    ctx.reply(
      infoText +
      text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(
      infoText +
      text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      infoText +
      text(3) + country.name,
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    return;
  }

  const demands = ctx.message.text;
  if (demands.match(new RegExp(`^${getText('revolution')[5]}$`))) {
    ctx.reply(
      infoText +
      text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    return;
  }

  const REVOLUTION_DEMANDS = getRevolutionDemands();
  const type = Object.keys(REVOLUTION_DEMANDS)
    .find(el => REVOLUTION_DEMANDS[el] === demands);

  if (!type) {
    ctx.reply(
      infoText +
      text(5),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
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
    ctx.reply(
      infoText +
      text(6),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    return;
  }
  const handleType = {
    'RIGHTS': () => {
      const rights = country.classes[parentClass].rights;
      const otherRights = [
        text(10),
        text(7),
        ...rights.filter(el => !country
          .classes[userClass]
          .rights
          .includes(el)
        )
      ];
      ctx.reply(
        infoText +
        text(8),
        Extra
          .load(reply)
          .markup(
            Markup.keyboard(otherRights)
              .oneTime()
              .resize()
              .selective(true)
          )
      );
      setState(id, 'preparingRevolution', 'choosingRights');
    },
    'CHANGE_PARENT': () => {
      const parents = Object.keys(country.classes)
        .filter(el => el !== userClass);
      parents.push(text(7));
      ctx.reply(
        infoText +
        text(8),
        Extra
          .load(reply)
          .markup(Markup.keyboard(parents)
            .oneTime()
            .resize()
            .selective(true)
          )
      );
      setState(id, 'preparingRevolution', 'choosingParent');
    }
  };
  const revolution = {
    type,
    revolter: userClass,
    rebels: [],
    reactioners: [],
  };
  setRevolution(country.chat, id, revolution);
  handleType[type]();
};

const choosingRights = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  const country = findUser(tag);
  if (!country) {
    ctx.reply(
      infoText +
      text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(
      infoText +
      text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      infoText +
      text(3) + country.name,
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setRevolution(country.chat, id);
    setState(id, 'preparingRevolution', null);
    return;
  }

  const right = ctx.message.text;
  //Cancel
  if (right.match(new RegExp(`^${text(7)}$`))) {
    ctx.reply(
      infoText +
      text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  //Done
  if (right.match(new RegExp(`^${text(10)}$`))) {
    ctx.reply(
      infoText +
      text(14),
      Extra
        .load(reply)
        .markup(Markup.keyboard([text(15), text(16)])
          .oneTime()
          .resize()
          .selective(true)
        )
    );
    setState(id, 'preparingRevolution', 'confirmation');
    return;
  }

  const userClass = country.citizens[tag].class;
  const parentClass = country.classes[userClass].parentClass;
  const parentRights = country.classes[parentClass].rights;

  const revolution = getRevolution(country.chat, id);
  if (!revolution) {
    ctx.reply(
      infoText +
      text(12),
      Extra
        .load(reply)
    );
    return;
  }

  if (country.classes[userClass].rights.includes(right)) {
    const otherRights = [text(10), text(7), ...parentRights.filter(
      el => !revolution.demands.includes(el)
    )];
    ctx.reply(
      infoText +
      text(21),
      Extra
        .load(reply)
        .markup(Markup.keyboard([text(10), text(7), ...otherRights])
          .oneTime()
          .resize()
          .selective(true)
        )
    );
    return;
  }
  if (!parentRights.includes(right)) {
    const otherRights = [text(10), text(7), ...parentRights.filter(
      el => !revolution.demands.includes(el)
    )];
    ctx.reply(
      infoText +
      text(11),
      Extra
        .load(reply)
        .markup(Markup.keyboard([text(10), text(7), ...otherRights])
          .oneTime()
          .resize()
          .selective(true)
        )
    );
    return;
  }

  if (!revolution.demands) revolution.demands = [];
  revolution.demands.push(right);
  const otherRights = [text(10), text(7), ...parentRights.filter(
    el => !revolution.demands.includes(el)
  )];
  setRevolution(country.chat, id, revolution);
  ctx.reply(
    infoText +
    right + text(13),
    Extra
      .load(reply)
      .markup(Markup.keyboard(otherRights)
        .oneTime()
        .resize()
        .selective(true)
      )
  );
};

const choosingParent = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  const country = findUser(tag);
  if (!country) {
    ctx.reply(
      infoText +
      text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(
      infoText +
      text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      infoText +
      text(3) + country.name,
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setRevolution(country.chat, id);
    setState(id, 'preparingRevolution', null);
    return;
  }

  const newParent = ctx.message.text;
  if (!Object.keys(country.classes).includes(newParent)) {
    ctx.reply(
      infoText +
      text(5),
      Extra
        .load(reply)
        .markup(Markup.keyboard([
          text(7),
          ...Object.keys(country.classes)
            .filter(el => el !== country.citizens[tag].class)
        ])
          .oneTime()
          .selective(true)
          .resize()
        )
    );
    return;
  }

  const revolution = getRevolution(country.chat, id);
  if (!revolution) {
    ctx.reply(
      infoText +
      text(12),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    return;
  }
  revolution.demands = newParent;
  setRevolution(country.chat, id, revolution);
  setState(id, 'preparingRevolution', 'confirmation');
  ctx.reply(
    infoText +
    text(17) +
    country.citizens[tag].class +
    text(17) +
    newParent +
    text(13)
  )
    .then(() => ctx.reply(
      infoText +
      text(14),
      Extra
        .load(reply)
        .markup(Markup.keyboard([text(15), text(16)])
          .oneTime()
          .resize()
          .selective(true)
        )
    ));
};

const confirmation = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  const country = findUser(tag);
  if (!country) {
    ctx.reply(
      infoText +
      text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(
      infoText +
      text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(
      infoText +
      text(3) + country.name,
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setRevolution(country.chat, id);
    setState(id, 'preparingRevolution', null);
    return;
  }
  //Cancel
  const { text: message } = ctx.message;
  if (message.match(new RegExp(`^${text(16)}$`))) {
    ctx.reply(
      infoText +
      text(4),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    setRevolution(country.chat, id);
    return;
  }
  //Done
  if (message.match(new RegExp(`^${text(15)}$`))) {
    ctx.reply(
      infoText +
      text(15),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'preparingRevolution', null);
    const revolution = getRevolution(country.chat, id);
    revolution.active = true;
    setRevolution(country.chat, id, revolution, true);
    ctx.reply(
      declareRevolutionaryDemands(country, id, tag),
      Extra.load({
        chat_id: `@${country.chat}`,
        reply_markup: Markup.inlineKeyboard([
          Markup.callbackButton(text(19), 'revolt'),
          Markup.callbackButton(text(20), 'reaction')
        ]),
        parse_mode: 'HTML',
      })
    );
    return;
  }
  ctx.reply(
    infoText +
    text(5),
    Extra
      .load(reply)
      .markup(Markup.keyboard([text(15), text(16)])
        .oneTime()
        .resize()
        .selective(true)
      )
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
