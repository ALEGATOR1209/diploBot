'use strict';

const {
  getText,
  getRevolution,
  getAllRights: rightslist,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'getRevolution',
    'getAllRights',
  ]);
const text = t => getText('revolution')[t];

const revoltToString = (country, id) => {
  if (!country) return;

  const revolution = getRevolution(country.chat, id);
  let demandsToString;

  if (revolution.type === 'RIGHTS') demandsToString = '\n✅' +
    revolution.demands
      .map(demand => rightslist[demand])
      .join('\n✅');

  if (revolution.type === 'CHANGE_PARENT') demandsToString = text(23)
    .replace('{parent}', revolution.demands)
    .replace('{child}', revolution.revolter);

  const playersNum = Object.keys(country.citizens).length;
  const rebels = revolution.rebels.length;
  const rebelsPercent = Math.floor(rebels * 100 / playersNum);
  const reactioners = revolution.reactioners.length;
  const reactionersPercent = Math.floor(reactioners * 100 / playersNum);

  return text(27)
    .replace('{class}', revolution.revolter)
    .replace('{type}', revolution.type === 'RIGHTS' ? text(28) : text(29)) +
    text(30) + demandsToString +
    text(31) +
    text(32).replace('{num}', rebelsPercent) +
    text(33).replace('{num}', reactionersPercent);
};

module.exports = revoltToString;
