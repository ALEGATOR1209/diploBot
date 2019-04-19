'use strict';

const Markup = require('telegraf/markup');
const {
  getAdmins,
  findUser,
  getText,
  getRevolutionDemands,
  setState,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'getRevolutionDemands',
    'setState',
  ]);
const text = t => getText('revolution')[t];

const revolution = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;

  if (getAdmins().includes(tag)) {
    ctx.reply(text(1), reply);
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(2), reply);
    return;
  }

  const inPrison = country.citizens[tag].inPrison;
  if (inPrison) {
    ctx.reply(text(3), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(4) + country.name, reply);
    return;
  }

  const REVOLUTION_DEMANDS = getRevolutionDemands();
  const types = Object.values(REVOLUTION_DEMANDS);
  types.push(text(5));
  ctx.reply(text(6), Markup.keyboard(types)
    .oneTime()
    .resize()
    .extra());

  setState(id, 'preparingRevolution', 'startRevolution');
};

module.exports = revolution;
