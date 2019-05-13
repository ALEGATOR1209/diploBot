'use strict';

const {
  getAdmins,
  getCountry,
  getRandomChoice,
  bury,
  findUser,
  getPlayers,
  editUser,
  getText,
  getDead,
  getKillPhrase,
  getGame,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getCountry',
    'getRandomChoice',
    'bury',
    'findUser',
    'getPlayers',
    'editUser',
    'getText',
    'getDead',
    'getKillPhrase',
    'getGame',
  ]);
const text = t => getText('shoot')[t];

const shoot = ctx => {
  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };

  const assassinate = (killer, victim) => {
    const country = findUser(killer);
    if (!country) {
      ctx.reply(text(8));
      return;
    }

    const timeout = getGame('shootTimeout');
    const shootDifference = new Date() - new Date(country
      .citizens[killer]
      .shoot
    ) || Infinity;
    if (shootDifference < timeout) {
      const timeToShoot = Date.parse(country.citizens[killer].shoot) + timeout;
      const timeoutTime = new Date(timeToShoot - new Date().valueOf());
      ctx.reply(
        text(11)
          .replace('{timeout}', new Date(timeout).getUTCHours())
          .replace('{hours}', timeoutTime.getUTCHours())
          .replace('{minutes}', timeoutTime.getUTCMinutes()),
        reply
      );
      return;
    }
    if (getAdmins().includes(victim)) {
      ctx.reply(text(3), reply);
      return;
    }
    if (getDead(victim)) {
      ctx.reply(text(7));
      return;
    }
    if (!country.citizens[victim]) {
      ctx.reply(`${text(4)} ${country.name}.`, reply);
      return;
    }
    const killed = parseInt(Math.random() * 100);
    const phrase = getRandomChoice(getKillPhrase(killed > 40));

    ctx.bot.telegram.getChat(killer)
      .then(man => {
        const edited = phrase.replace('{killer}', `@${man.username}`);
        ctx.bot.telegram.getChat(victim)
          .then(man => {
            const final = edited.replace('{victim}', `@${man.username}`);
            ctx.reply(
              final +
              text(5) + killed + text(6),
              {
                chat_id: `@${country.chat}`,
                parse_mode: 'HTML',
              }
            );
          }).catch(console.error);
      }).catch(console.error);

    editUser(country.chat, killer, {
      shoot: new Date(),
    });
    if (killed > 40) bury(victim);
  };

  const { username: countryTag } = ctx.message.chat;
  const { id } = ctx.message.from;

  const country = getCountry(countryTag);
  if (!findUser(id)) {
    ctx.reply(text(8), reply);
    return;
  }
  if (!country || country.chat !== findUser(id).chat) {
    ctx.reply(text(12), reply);
    return;
  }

  if (getAdmins().includes(id)) {
    ctx.reply(text(1), reply);
    return;
  }

  if (!country.citizens[id]) {
    ctx.reply(text(2));
    return;
  }

  let victim = ctx.message.text
    .match(/ .*$/);
  if (!victim) {
    ctx.reply(text(2), reply);
    assassinate(id, getRandomChoice(Object.keys(findUser(id).citizens)));
    return;
  }
  victim = victim[0].trim().slice(1);

  const players = getPlayers();
  let targetFound = false;
  players.forEach(player => ctx.bot
    .telegram
    .getChat(player)
    .then(user => {
      if (user.username === victim) {
        assassinate(id, user.id);
        targetFound = true;
      }
    })
    .finally(() => {
      if (!targetFound) {
        ctx.reply(text(10), reply);
      }
    })
    .catch(e => console.error(e))
  );
};

module.exports = shoot;
