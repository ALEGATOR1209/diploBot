'use strict';

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
  getPlayers,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getRandomChoice',
    'bury',
    'getText',
    'getDead',
    'getKillPhrase',
    'getGame',
    'editUser',
    'getPlayers',
  ]);
const text = t => getText('kill')[t];

const kill = ctx => {
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };
  const { id } = ctx.message.from;
  const assassinate = (killer, victim) => {
    const country = findUser(killer);
    if (!country) {
      ctx.reply(text(0));
      return;
    }
    if (country.hasRevolution) {
      ctx.reply(text(6));
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
        text(13)
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
      ctx.reply(text(5));
      return;
    }
    if (!country.citizens[victim]) {
      ctx.reply(`${text(4)} ${country.name}.`, reply);
      return;
    }
    const killed = parseInt(Math.random() * 100);
    const incognito = parseInt(Math.random() * 100);
    const phrase = getRandomChoice(getKillPhrase(killed > 60));

    if (incognito > 40) {
      const edited = phrase.replace('{killer}', text(7));
      ctx.bot.telegram.getChat(victim)
        .then(man => {
          const final = edited.replace('{victim}', `@${man.username}`);
          ctx.reply(
            final +
            text(8) + killed + text(9) +
            text(8) + incognito + text(10),
            {
              chat_id: `@${country.chat}`,
              parse_mode: 'HTML',
            }
          );
        })
        .catch(console.error);
    } else {
      ctx.bot.telegram.getChat(killer)
        .then(man => {
          const edited = phrase.replace('{killer}', `@${man.username}`);
          ctx.bot.telegram.getChat(victim)
            .then(man => {
              const final = edited.replace('{victim}', `@${man.username}`);
              ctx.reply(
                final +
                text(8) + killed + text(9) +
                text(8) + incognito + text(10),
                {
                  chat_id: `@${country.chat}`,
                  parse_mode: 'HTML',
                }
              );
            })
            .catch(console.error);
        })
        .catch(console.error);
    }

    editUser(country.chat, killer, {
      shoot: new Date(),
    });
    if (killed > 60) bury(victim);
  };

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(id)) {
    ctx.reply(text(1), reply);
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
      const country = findUser(id);
      if (!targetFound) {
        ctx.reply(text(12), reply);
        return;
      }
      if (ctx.message.chat.username !== country.chat) {
        ctx.reply(text(11), reply);
      }
    })
    .catch(e => console.error(e))
  );
};

module.exports = kill;
