'use strict';

const {
  getText,
  getRevolutionDemands,
  getRevolution,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getRevolutionDemands',
    'getRevolution',
  ]);
const text = t => getText('declareRevolutionaryDemands')[t];

const declareRevolutionaryDemands = (country, id, tag) => {
  if (!country) return;
  const revolution = getRevolution(country.chat, id);
  const demands = getRevolutionDemands();
  let demandsToString;
  if (revolution.type === 'RIGHTS') {
    demandsToString = '\n✅' + revolution.demands.join('\n✅');
  }
  if (revolution.type === 'CHANGE_PARENT') {
    demandsToString = text(8) + revolution.demands + text(9);
  }

  const playersNum = Object.keys(country.citizens).length;
  const rebels = revolution.rebels.length;
  const rebelsPercent = Math.floor(rebels * 100 / playersNum);
  const reactioners = revolution.reactioners.length;
  const reactionersPercent = Math.floor(reactioners * 100 / playersNum);
  return text(1) +
    country.citizens[tag].class +
    text(2) +
    text(3 + Object.keys(demands).findIndex(el => el === revolution.type)) +
    text(5) +
    demandsToString +
    text(6) + tag +
    text(7) +
    text(12) + rebelsPercent + text(13) +
    text(12) + reactionersPercent + text(13);
};

module.exports = declareRevolutionaryDemands;
