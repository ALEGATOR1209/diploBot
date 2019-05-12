'use strict';

const {
  findUser,
  getText,
  getDead,
  getGame,
  getMigrationClass,
  getAllCountries,
} = require('../../../imports')
  .few('countryBot', 'scripts',
    [
      'findUser',
      'getText',
      'getDead',
      'getGame',
      'getMigrationClass',
      'getAllCountries',
    ]);
const text = t => getText('whereami')[t];
const whereami = ctx => {
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };
  const { id } = ctx.message.from;
  const dead = getDead(id);
  const turn = getGame('turn');

  let message = text(1).replace('{turn}', turn);
  if (dead && Object.keys(dead).length > 0) {
    const deathTime = getGame('deathTime');
    message += text(2).replace('{turn}', turn - deathTime);
  }
  const country = findUser(id);
  if (country) {
    message += text(3)
      .replace('{country}', country.name)
      .replace('{class}', country.citizens[id].class);

    if (country.emigrantQueue.includes(id)) {
      message += text(4);
    }

    if (country.citizens[id].inPrison) message += text(7);
    else message += text(8);

    const population = Object.keys(country.citizens).length;
    message += text(9).replace('{population}', population);

    if (country.hasRevolution) message += text(10);
    else message += text(11);

    message += text(12).replace('{class}', country.migrantClass);
  } else if (!dead) {
    const countrylist = getAllCountries();
    let migrant = false;
    for (const name in countrylist) {
      const blob = countrylist[name];
      if (blob.immigrantQueue.includes(id)) {
        message += text(5).replace('{country}', blob.name);
        migrant = true;
        break;
      }
    }
    if (!migrant) message += text(6);
  }

  ctx.reply(message, reply);
};

module.exports = whereami;
