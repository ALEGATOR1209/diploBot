'use strict';

const shoot = async charon => {
  const {
    getAdmins,
    getCountry,
    getRandomChoice,
    bury,
    findUser,
    editUser,
    getText,
    getDead,
    getGame,
  } = charon.get([
    'getAdmins',
    'getCountry',
    'getRandomChoice',
    'bury',
    'findUser',
    'editUser',
    'getText',
    'getDead',
    'getGame',
  ]);
  const text = t => getText('shoot')[t];

  if (getGame('turn') === 0) {
    charon.reply(getText('0turnAlert'));
    return;
  }
  const { username: countryTag } = charon.message.chat;
  const { id, username } = charon.message.from;

  const country = getCountry(countryTag);
  if (!findUser(id)) {
    charon.reply(text(8));
    return;
  }
  if (!country || country.chat !== findUser(id).chat) {
    charon.reply(text(12));
    return;
  }

  if (getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }

  if (!country.citizens[id]) {
    charon.reply(text(2));
    return;
  }

  const { mentions } = charon;
  let victim;
  if (mentions.length === 0 && charon.message.entities.length > 1) {
    charon.reply(text(10));
    return;
  }
  if (!mentions.length) {
    charon.reply(text(9));
    victim = await charon.getChat(
      getRandomChoice(
        Object.keys(country.citizens)
      )
    );
  } else victim = mentions[0];

  const timeout = getGame('shootTimeout');
  const shootDifference = new Date() - new Date(country
    .citizens[id]
    .shoot
  ) || Infinity;
  if (shootDifference < timeout) {
    const timeToShoot = Date.parse(country.citizens[id].shoot) + timeout;
    const timeoutTime = new Date(timeToShoot - new Date().valueOf());
    charon.reply(
      text(11)
        .replace('{timeout}', new Date(timeout).getUTCHours())
        .replace('{hours}', timeoutTime.getUTCHours())
        .replace('{minutes}', timeoutTime.getUTCMinutes())
    );
    return;
  }
  if (getAdmins().includes(victim.id)) {
    charon.reply(text(3));
    return;
  }
  if (getDead(victim.id)) {
    charon.reply(text(7));
    return;
  }
  if (!country.citizens[victim.id]) {
    charon.reply(`${text(4)} ${country.name}.`);
    return;
  }
  const killed = parseInt(Math.random() * 100);
  const phrase = killed > 40 ?
    getText('killPhrases').success : getText('killPhrases').fail;

  charon.reply(
    phrase
      .replace('{killer}', `@${username}`)
      .replace('{victim}', `@${victim.username}`) +
    text(5) + killed + text(6),
    null,
    { chat_id: `@${country.chat}` }
  );
  editUser(country.chat, id, {
    shoot: new Date(),
  });
  if (killed > 40) bury(victim.id);
};

module.exports = shoot;
