'use strict';

const getCountry = require('./getCountry');
const getAdmins = require('./getAdmins');
const rightsString = require('./rightsString');

const rights = ctx => {
  let tag = ctx.message
    .text
    .match(/ .*$/);
  if (tag) tag = tag[0].trim().slice(1);
  else tag = ctx.message.from.username || ctx.message.from.id;

  const { username: link, id: countryId } = ctx.message.chat;
  const country = getCountry(link) || getCountry(countryId);
  if (!country) {
    return;
  }

  if (getAdmins().includes(tag)) {
    ctx.reply(
      `@${tag} rights:\n\n✅ Право быть самым лучшим.`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const user = country.citizens[tag];
  if (!user) {
    ctx.reply(
      `There is no such user in ${country.name}.`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const userClass = country.classes[user.class];
  ctx.reply(
    'Rights:\n\n' +
    rightsString(userClass.rights) + '\n' +
    (user.inPrison ? '🔴 **Игрок в тюрьме.**' : 'Игрок на свободе.'),
    { reply_to_message_id: ctx.message.message_id }
  );
};

module.exports = rights;
