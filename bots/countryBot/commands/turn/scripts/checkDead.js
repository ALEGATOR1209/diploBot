'use strict';

const {
  getText,
  getGame,
  getDead,
  resurrect,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'getGame',
    'getDead',
    'resurrect',
  ]);
const text = t => getText('checkDead')[t];

const checkDead = ctx => {
  const cemetery = getDead();
  const turn = getGame('turn');
  const deathTime = getGame('deathTime');
  let resurrectionList = text(1);

  for (const corpse in cemetery) {
    if (turn - cemetery[corpse].dateOfDeath >= deathTime) {
      resurrect(corpse);
      resurrectionList += `${text(2)} @${corpse}\n`;
    }
  }
  const resurrectedNum = resurrectionList
    .split('\n')
    .slice(1)
    .filter(str => str.length)
    .length;
  if (resurrectedNum > 0)
    ctx.reply(
      resurrectionList,
      { chat_id: getGame('gameChannel') }
    );
};

module.exports = checkDead;
