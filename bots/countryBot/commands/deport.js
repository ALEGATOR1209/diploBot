'use strict';

const {
  findUser,
  getText,
  getChildClasses,
  deportUser,
  getGame,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getChildClasses',
    'deportUser',
    'getGame',
  ]);
const text = t => getText('deport')[t];

const deport = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);

  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }

  if (!country) {
    ctx.reply(text(0) + text(1));
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(10));
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];

  if (country.citizens[tag].inPrison) {
    ctx.reply(text(0) + text(7));
    return;
  }
  if (!userClass.rights.includes('Право изгонять из страны')) {
    ctx.reply(text(0) + text(2));
    return;
  }

  let target = ctx.message.text
    .match(/ .*$/g);
  if (!target) {
    ctx.reply(text(0) + text(3));
    return;
  }

  target = target[0].trim();
  if (target[0] === '@') target = target.slice(1);
  const targetCountry = findUser(target);
  if (!targetCountry || targetCountry.chat !== country.chat) {
    ctx.reply(text(0) + text(4));
    return;
  }
  const targetClass = country.citizens[target].class;
  const childClasses = getChildClasses(
    targetClass, Object.keys(country.classes)
  );
  if (childClasses.includes(userClassName)) {
    ctx.reply(text(0) + text(5));
    return;
  }

  if (country.citizens[target].inPrison) {
    ctx.reply(text(0) + text(9));
    return;
  }

  deportUser(country.chat, target);
  ctx.reply(`${text(0)}${text(8)} @${target} ${text(6)} ${country.name}`);
  if (ctx.message.chat.username !== country.chat) {
    ctx.reply(
      `${text(8)} @${target} ${text(6)} ${country.name}`,
      { chat_id: `@${country.chat}` }
    );
  }
};

module.exports = deport;
