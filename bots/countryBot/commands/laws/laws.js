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
const text = t => getText('laws')[t];

const laws = ctx => {
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
  } else if (getCountry(ctx.message.chat.username)) {
    country = getCountry(ctx.message.chat.username);
  } else {
    ctx.reply(text(1), reply);
    return;
  }

  const lawlist = country.laws;
  const list = Object.keys(lawlist)
    .filter(law => !law.WIP);
  if (list.length < 1) {
    ctx.reply(text(6), reply);
    return;
  }
  let answer = text(2) + `<b>${country.name.toUpperCase()}</b>\n\n`;
  for (const law of list) {
    answer +=
      `${text(3)} ${law} ${text(3)}\n` +
      `${text(4)}${lawlist[law].date}${text(5)}\n\n`;
  }
  ctx.reply(answer, reply);
};

module.exports = laws;
