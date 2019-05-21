'use strict';

const kill = charon => {
  const {
    getAdmins,
    findUser,
    getRandomChoice,
    bury,
    getText,
    getDead,
    getKillPhrase,
    getGame,
    editUser,
  } = charon.get([
    'getAdmins',
    'findUser',
    'getRandomChoice',
    'bury',
    'getText',
    'getDead',
    'getKillPhrase',
    'getGame',
    'editUser',
  ]);
  const text = t => getText('kill')[t];

  const { id, username } = charon.message.from;

  if (getGame('turn') === 0) {
    charon.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(id)) {
    charon.reply(text(1));
    return;
  }

  const { mentions } = charon;
  let victim;
  let victimTag;
  if (!mentions) {
    charon.reply(text(2));
    victim = getRandomChoice(Object.keys(findUser(id).citizens));
    return;
  } else {
    victim = mentions[0].id;
    victimTag = mentions[0].username;
  }

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0));
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(6));
    return;
  }

  const timeout = getGame('shootTimeout');
  const shootDifference = new Date() - new Date(country
    .citizens[id]
    .shoot
  ) || Infinity;
  if (shootDifference < timeout) {
    const timeToShoot = Date.parse(country.citizens[id].shoot) + timeout;
    const timeoutTime = new Date(timeToShoot - new Date().valueOf());
    charon.reply(
      text(13)
        .replace('{timeout}', new Date(timeout).getUTCHours())
        .replace('{hours}', timeoutTime.getUTCHours())
        .replace('{minutes}', timeoutTime.getUTCMinutes())
    );
    return;
  }
  if (getAdmins().includes(victim)) {
    charon.reply(text(3));
    return;
  }
  if (getDead(victim)) {
    charon.reply(text(5));
    return;
  }
  if (!country.citizens[victim]) {
    charon.reply(`${text(4)} ${country.name}.`);
    return;
  }
  const killed = parseInt(Math.random() * 100);
  const incognito = parseInt(Math.random() * 100);
  const phrase = getRandomChoice(getKillPhrase(killed > 60));

  if (incognito > 40) {
    const answer = phrase
      .replace('{killer}', text(7))
      .replace('{victim}', `@${victimTag}`);
    charon.reply(
      answer +
      text(8) + killed + text(9) +
      text(8) + incognito + text(10),
      null,
      { chat_id: `@${country.chat}` }
    );
  } else {
    const answer = phrase
      .replace('{killer}', `@${username}`)
      .replace('{victim}', `@${victimTag}`);
    charon.reply(
      answer +
      text(8) + killed + text(9) +
      text(8) + incognito + text(10),
      null,
      { chat_id: `@${country.chat}` }
    );
  }

  if (charon.message.chat.username !== country.chat) {
    charon.reply(text(14).replace('{chat}', country.chat));
  }

  editUser(country.chat, id, {
    shoot: new Date(),
  });
  if (killed > 60) bury(victim);
};

module.exports = kill;
