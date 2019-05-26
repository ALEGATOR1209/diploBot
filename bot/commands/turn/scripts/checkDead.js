'use strict';

const checkDead = async charon => {
  const {
    getText,
    getGame,
    getDead,
    resurrect,
  } = charon.get([
    'getText',
    'getGame',
    'getDead',
    'resurrect',
  ]);
  const text = t => getText('checkDead')[t];

  const cemetery = getDead();
  const turn = getGame('turn');
  const deathTime = getGame('deathTime');
  let resurrectionList = text(1);

  for (const corpse in cemetery) {
    if (turn - cemetery[corpse].dateOfDeath >= deathTime) {
      resurrect(corpse);
      const { username } = await charon.getChat(corpse);
      resurrectionList += `${text(2)} @${username}\n`;
    }
  }
  const resurrectedNum = resurrectionList
    .split('\n')
    .slice(1)
    .filter(str => str.length)
    .length;
  if (resurrectedNum > 0)
    charon.reply(
      resurrectionList,
      { chat_id: getGame('gameChannel') }
    );
};

module.exports = checkDead;
