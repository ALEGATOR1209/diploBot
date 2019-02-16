'use strict';

const findUser = require('./findUser');
const getText = id => require('./getText')(`deport.${id}`);
const getChildClasses = require('./getChildClasses');
const deportUser = require('./deportUser');

const deport = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);

  if (!country) {
    ctx.reply(getText(1));
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];

  if (!userClass.rights.includes('Право изгонять из страны')) {
    ctx.reply(getText(2));
    return;
  }

  let target = ctx.message.text
    .match(/ .*$/g);
  if (!target) {
    ctx.reply(getText(3));
    return;
  }

  target = target[0].trim();
  if (target[0] === '@') target = target.slice(1);
  const targetCountry = findUser(target);
  if (!targetCountry || targetCountry.chat !== country.chat) {
    ctx.reply(getText(4));
    return;
  }
  const targetClass = country.citizens[target].class;
  const childClasses = getChildClasses(
    targetClass, Object.keys(country.classes)
  );
  if (childClasses.includes(userClassName)) {
    ctx.reply(getText(5));
    return;
  }

  deportUser(country.chat, target);
  ctx.reply(
    `@${target} ${getText(6)} ${country.name}`,
    { chat_id: `@${country.chat}` }
  );
};

module.exports = deport;
