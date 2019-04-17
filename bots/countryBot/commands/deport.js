'use strict';

const {
  findUser,
  getText,
  getChildClasses,
  deportUser,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getChildClasses',
    'deportUser',
  ]);
const text = t => getText('deport')[t];

const deport = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);

  if (!country) {
    ctx.reply(text(1));
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];

  if (!userClass.rights.includes('Право изгонять из страны')) {
    ctx.reply(text(2));
    return;
  }

  let target = ctx.message.text
    .match(/ .*$/g);
  if (!target) {
    ctx.reply(text(3));
    return;
  }

  target = target[0].trim();
  if (target[0] === '@') target = target.slice(1);
  const targetCountry = findUser(target);
  if (!targetCountry || targetCountry.chat !== country.chat) {
    ctx.reply(text(4));
    return;
  }
  const targetClass = country.citizens[target].class;
  const childClasses = getChildClasses(
    targetClass, Object.keys(country.classes)
  );
  if (childClasses.includes(userClassName)) {
    ctx.reply(text(5));
    return;
  }

  deportUser(country.chat, target);
  ctx.reply(
    `@${target} ${text(6)} ${country.name}`,
    { chat_id: `@${country.chat}` }
  );
};

module.exports = deport;
