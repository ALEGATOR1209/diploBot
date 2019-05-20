'use strict';

const {
  findUser,
  getText,
  getCountry,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getCountry',
  ]);
const text = t => getText('blacklist')[t];

const blacklist = ctx => {
  const { id } = ctx.message.from;
  const reply = {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML',
  };
  let country;
  if (ctx.message.chat.type === 'private') {
    country = findUser(id);
    if (!country) {
      ctx.reply(text(1), reply);
      return;
    }
    if (country.hasRevolution) {
      ctx.reply(text(7), reply);
      return;
    }
  } else if (getCountry(ctx.message.chat.username)) {
    country = getCountry(ctx.message.chat.username);
  } else {
    ctx.reply(text(1), reply);
    return;
  }

  const blacklist = Object.keys(country.blacklist);
  if (blacklist.length < 1) {
    ctx.reply(text(6), reply);
    return;
  }
  let answer = text(2) + `<b>${country.name}</b>\n`;

  blacklist
    .forEach((pid, i) => ctx.bot
      .telegram
      .getChat(pid)
      .then(({ username }) => answer +=
        `${text(5)}@${username} ` +
        `- ${text(3) + country.blacklist[pid].banTurn + text(4)}.`
      )
      .catch(console.error)
      .finally(() => i !== blacklist.length - 1 || ctx.reply(answer, reply))
    );
};

module.exports = blacklist;
