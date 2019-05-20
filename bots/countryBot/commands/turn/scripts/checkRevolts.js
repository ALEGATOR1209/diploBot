'use strict';

const {
  getText,
  getAllCountries,
  setRevolution,
  newClass,
  getGame,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'getAllCountries',
    'setRevolution',
    'newClass',
    'getGame',
  ]);
const text = t => getText('checkRevolts')[t];

const revolutionsResolvers = {
  CHANGE_PARENT: (country, id) => {
    const { demands, revolter } = country.revolution[id];
    newClass(country.chat, revolter, {
      parentClass: demands,
    });
    setRevolution(country.chat, id);
  },
  RIGHTS: (country, id) => {
    const { demands, revolter } = country.revolution[id];
    const winnerClass = country.classes[revolter];
    newClass(country.chat, revolter, {
      rights: [...demands, ...winnerClass.rights],
    });
    setRevolution(country.chat, id);
  },
};

const checkRevolts = ctx => {
  const countries = getAllCountries();
  for (const state in countries) {
    const country = countries[state];
    if (country.hasRevolution) {
      let answer = text(1) + country.name;
      const revId = Object.keys(country.revolution)
        .find(rev => country.revolution[rev].active);
      const { type, rebels, reactioners } = country.revolution[revId];
      const victory = reactioners.length < rebels.length;

      if (victory) {
        revolutionsResolvers[type](country, revId);
        answer += text(3);
      } else {
        answer += text(2);
        setRevolution(country.chat, revId);
      }

      answer += text(4);
      const revolution = country.revolution[revId];
      if (revolution.type === 'CHANGE_PARENT') {
        answer += text(5)
          .replace('{parent}', revolution.demands)
          .replace('{child}', revolution.revolter)
      }   else {
        answer += '✅' + revolution.demands
          .join('\n✅');
      }

      answer += '\n\n' + (victory ? text(8) : text(7));
      ctx.reply(
        answer,
        { chat_id: getGame('gameChannel') }
      );
    }
  }
};

module.exports = checkRevolts;
