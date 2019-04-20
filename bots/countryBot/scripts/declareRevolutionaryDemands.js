'use strict';

const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  getRevolutionDemands,
  getStates,
  getRevolution,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getRevolutionDemands',
    'getStates',
    'getRevolution',
  ]);
const text = t => getText('declareRevolutionaryDemands')[t];

const declareRevolutionaryDemands = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);
  if (!country) return;
  const revolution = getRevolution(country.chat, id);
  const demands = getRevolutionDemands();
  let demandsToString;
  if (revolution.type === 'RIGHTS') {
    demandsToString = '\n✅' + revolution.demands.join('\n✅');
  }
  if (revolution.type === 'CHANGE_PARENT') {
    demandsToString = text(9) + revolution.demands + text(10);
  }
  ctx.reply(
    text(1) +
    country.citizens[tag].class +
    text(2) +
    text(3 + Object.keys(demands).findIndex(el => el === revolution.type)) +
    text(5) +
    demandsToString +
    text(6) + tag +
    text(7) + revolution.cost + text(8),
    { chat_id: `@${country.chat}` }
  );
};

module.exports = declareRevolutionaryDemands;
